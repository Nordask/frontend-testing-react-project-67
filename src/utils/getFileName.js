const removeExtension = (address) => {
    const trimmedAddress = address.trim();
    const extensionIndex = trimmedAddress.lastIndexOf('.');
    const lastSlashIndex = trimmedAddress.lastIndexOf('/');

    if (extensionIndex !== -1 && extensionIndex > lastSlashIndex) {
        return trimmedAddress.substring(0, extensionIndex);
    }
    return trimmedAddress;
};

export const getFileName = (address) => {
    try {
        const url = new URL(removeExtension(address));
        return `${url.hostname}${url.pathname || ''}`.replace(/[^0-9a-z]/gi, '-');
    } catch (e) {
        throw new Error(`Incorrect address ${address}`);
    }
};

export default getFileName;
