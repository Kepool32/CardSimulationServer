export function detectCardType(cardNumber: string): string {
    const cleanedNumber = cardNumber.replace(/\D/g, '');

    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanedNumber)) {
        return 'Visa';
    } else if (/^5[1-5][0-9]{14}$/.test(cleanedNumber)) {
        return 'Mastercard';
    } else if (/^3[47][0-9]{13}$/.test(cleanedNumber)) {
        return 'American Express';
    } else if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cleanedNumber)) {
        return 'Discover';
    } else if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cleanedNumber)) {
        return 'JCB';
    } else {
        return 'Unknown';
    }
}
