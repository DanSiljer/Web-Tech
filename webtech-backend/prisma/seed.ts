import { PrismaClient } from "@prisma/client"
import { hashSync } from "bcrypt";
import { resolve } from "path";
import * as Excel from 'exceljs'



export async function app() {
    const prismaService = new PrismaClient()

    // insert table price 
    await prismaService.tabPrice.createMany({
        data: [
            { id: '13', tabPrice: 'e-comerce' },
            { id: '12', tabPrice: 'store' }
        ],
        skipDuplicates: true
    });

    // insert log fields table 
    await prismaService.logProductsPriceField.createMany({
        data: [
            { field: 'preco1' },
            { field: 'discountPromotion' },
            { field: 'priceLiquid' }
        ],
        skipDuplicates: true
    })

    //insert user admin
    await prismaService.user.create({
        data: {
            name: 'ADMIN RESTOQUE',
            email: 'admin@restoque.com.br',
            password: hashSync('adminRestoque', 10),
            admin: '1',
        }
    })

    let filePath = resolve('shared', 'seed.xlsx');

    const workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1);

    const products = [];

    worksheet.eachRow((row) => {
        let product = {
            product: row.getCell(1).value,
            name: row.getCell(2).value,
            description: row.getCell(3).value,
            collection: row.getCell(4).value.toString(),
            grife: row.getCell(5).value,
            available: row.getCell(6).value.toString(),
            ProductPrice: {
                create: {
                    price1: row.getCell(7).value,
                    discountLimit: row.getCell(8).value,
                    discountPromotion: row.getCell(9).value,
                    priceLiquid: row.getCell(10).value,
                    tabPrice: {
                        connect: {
                            id: row.getCell(11).value.toString()
                        }
                    },
                }
            }
        }

        products.push(product)
    })
    products.forEach(async (product) => {

        await prismaService.product.create({ data: product });
    })

}

app()