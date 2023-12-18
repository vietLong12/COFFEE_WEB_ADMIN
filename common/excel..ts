import * as FileSaver from 'file-saver';
import * as ExcelProper from 'exceljs';
import * as Excel from 'exceljs/dist/exceljs';
import moment from 'moment';
import { Account } from '../types/types';
import { convertDateTimeFormat } from './utils/util';

export const exportDataAccount = (data: Account[]) => {
    console.log('data: ', data);
    let workbook: ExcelProper.Workbook = new Excel.Workbook();

    //create sheet
    let worksheet1 = workbook.addWorksheet('Danh sach tai khoan');

    worksheet1.getColumn('A').width = 5;
    worksheet1.getColumn('B').width = 30;
    worksheet1.getColumn('C').width = 20;
    worksheet1.getColumn('D').width = 30;
    worksheet1.getColumn('E').width = 10;
    worksheet1.getColumn('F').width = 20;
    worksheet1.getColumn('G').width = 20;
    worksheet1.getColumn('H').width = 20;
    worksheet1.getColumn('I').width = 20;
    worksheet1.getColumn('J').width = 25;

    worksheet1.mergeCells('B1:D1');
    worksheet1.getCell('B1').value = 'Danh sách tài khoản Monster Coffee';
    worksheet1.getCell('B1').font = {
        name: 'Calibri',
        size: 18,
        bold: true
    };

    let listHeaderTable1 = ['STT', 'Id', 'Tên tài khoản', 'Email', 'Password', 'Số điện thoại', 'Ngày tạo tài khoản', 'Ngày chỉnh sửa gần nhất', 'Avatar', 'Số lượng hàng trong giỏ'];

    let startIndex: number = 3;
    worksheet1.addRow(listHeaderTable1);
    //fill data
    for (let i = 0; i < data.length; i++) {
        worksheet1.addRow([]);
        worksheet1.getCell('A' + (startIndex + i)).value = i + 1;
        worksheet1.getCell('B' + (startIndex + i)).value = data[i]._id;
        worksheet1.getCell('C' + (startIndex + i)).value = data[i].username;
        worksheet1.getCell('D' + (startIndex + i)).value = data[i].email;
        worksheet1.getCell('E' + (startIndex + i)).value = data[i].password;
        worksheet1.getCell('F' + (startIndex + i)).value = data[i].phone;
        worksheet1.getCell('G' + (startIndex + i)).value = convertDateTimeFormat(data[i].createdAt);
        worksheet1.getCell('H' + (startIndex + i)).value = convertDateTimeFormat(data[i].updatedAt);
        worksheet1.getCell('I' + (startIndex + i)).value = data[i].avatar;
        worksheet1.getCell('J' + (startIndex + i)).value = data[i].cart?.items.length;
    }

    worksheet1.eachRow((cell, index) => {
        if (cell.hasValues) {
            cell.border = {
                top: { style: 'thin', color: { argb: '#000000' } },
                left: { style: 'thin', color: { argb: '#000000' } },
                bottom: { style: 'thin', color: { argb: '#000000' } },
                right: { style: 'thin', color: { argb: '#000000' } }
            };
        }
    });

    workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'Danh_sach_tai_khoan_' + moment(new Date()).format('DD/MM/YYYY') + '.xlsx');
    });
};
