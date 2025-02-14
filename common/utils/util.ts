export function convertDateTimeFormat(isoDateString: string) {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year} `;
}

export function getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
}

//Chuyển định dạng số 1000 -> 1.000
export function numberWithCommas(x: number | string | undefined) {
    if (!x) {
        return '0';
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function convertToVND(tien: any) {
    let temp = '0';
    if (tien) {
        temp = tien.toString() + '000';
    }
    //@ts-ignore
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(temp);
}
