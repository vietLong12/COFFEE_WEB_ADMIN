import { Product } from '../../../../types/types';

export function getRandomNumber(num: number) {
    return Math.floor(Math.random() * num) + 1;
}

function genRandonString(length: number) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    var charLength = chars.length;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}

function getRandomRating() {
    return Math.floor(Math.random() * 5) + 1;
}

for (let i = 0; i < data.length; i++) {
    data[i].rating = getRandomRating();
}

export const dataService = [
    {
        id: 0,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/service_1.png?1676280956426',
        title: 'Cà phê',
        desc: 'Sự kết hợp hoàn hảo giữa hạt cà phê Robusta & Arabica thượng hạng được trồng trên những vùng cao nguyên Việt Nam màu mỡ, qua những bí quyết rang...'
    },
    {
        id: 1,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/service_2.png?1676280956426',
        title: 'Trà',
        desc: 'Hương vị tự nhiên, thơm ngon của Trà Việt với phong cách hiện đại tại Monster Coffee sẽ giúp bạn gợi mở vị giác của bản thân và tận hưởng một cảm giác thật khoan khoái, tươi mới.'
    },
    {
        id: 2,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/service_3.png?1676280956426',
        title: 'Bánh ngọt',
        desc: 'Những chiếc bánh của chúng tôi mang hương vị đặc trưng của ẩm thực Việt và còn là sự Tận Tâm, gửi gắm mà chúng tôi dành cho Quý khách hàng.'
    }
];

export const dataMenuList = [data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)], data[getRandomNumber(23)]];
export default data;

export const dataUserReview = [
    {
        id: 0,
        username: 'Minh Nguyệt',
        gender: 'female',
        rateStar: 5,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/reviews_1.png?1676280956426',
        cmt: 'Tôi thật sự yêu thích quán cafe này. Thái độ phục vụ tuyệt vời, đồ uống phong phú, bánh ngon và không gian rất đẹp. Điều này giúp tôi có những bức ảnh đẹp và trải nghiệm hẹn hò lãng mạn cùng bạn bè.'
    },
    {
        id: 1,
        username: 'Thanh Tiền',
        gender: 'female',
        rateStar: 4,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/reviews_2.png?1676280956426',
        cmt: 'Đúng với tên gọi của quán, thật sự là một nơi tuyệt vời để sống ảo. Đồ uống ngon, không gian đẹp và hợp khẩu vị của tôi. Tôi rất hài lòng với trải nghiệm của mình tại đây.'
    },
    {
        id: 2,
        username: 'Hữu Mạnh',
        gender: 'male',
        rateStar: 3,
        img: 'https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/reviews_3.png?1676280956426',
        cmt: 'Quán này có tiềm năng, nhưng cần cải thiện một chút. Đồ uống ngon và không gian đẹp, nhưng thái độ phục vụ có thể được cải thiện hơn. Tôi hy vọng sẽ thấy sự cải thiện trong tương lai.'
    },
    {
        id: 4,
        username: 'Tuấn Anh',
        gender: 'male',
        rateStar: 4,
        img: 'https://us.123rf.com/450wm/hyunsuss/hyunsuss1303/hyunsuss130300340/18498179-tr%E1%BA%BB-ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-ch%C3%A2u-%C3%81-%C4%91%C3%B3ng-l%C3%AAn-b%E1%BA%AFn-b%E1%BB%8B-c%C3%B4-l%E1%BA%ADp-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.jpg?ver=6',
        cmt: 'Quán cafe này thực sự ấn tượng. Đồ uống đa dạng và ngon miệng. Tôi rất thích không gian tại đây, nó tạo cơ hội tuyệt vời để thư giãn và tận hưởng thời gian với bạn bè.'
    },
    {
        id: 5,
        username: 'Linh Chi',
        gender: 'female',
        rateStar: 5,
        img: 'https://cdn.24h.com.vn/upload/1-2022/images/2022-03-16/baukrysie_275278910_3174792849424333_1380029197326773703_n-1647427653-670-width1440height1800.jpg',
        cmt: 'Điều tuyệt vời nhất ở quán này là không gian. Nó thực sự là nơi lý tưởng để sống ảo và chụp ảnh. Đồ uống cũng rất ngon, và tôi luôn thấy thoải mái khi đến đây.'
    }
    // Thêm các đối tượng khác ở đây...
];
