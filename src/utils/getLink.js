export const getLink = (host, address) => {
    const link = new URL(address, host);

    if (link.hostname === new URL(host).hostname) {
        return link.href;
    }

    return null;
};