export function getRandomCoordinates() : { latitude: number, longitude: number } {
    const minLat = -90;
    const maxLat = 90;
    const minLon = -180;
    const maxLon = 180;

    const latitude = Math.random() * (maxLat - minLat) + minLat;
    const longitude = Math.random() * (maxLon - minLon) + minLon;

    return { latitude, longitude };
}

export function getRandomTimeout(): number {
    const timeouts: number[] = [];
    for (let i = 50; i <= 150; i += 10) {
        timeouts.push(i);
    }

    const randomIndex = Math.floor(Math.random() * timeouts.length);
    return timeouts[randomIndex];
}

export function findCookieValue(cookies: any[], cookieName: string): string | null {
    const cookie = cookies.find((c) => c.name === cookieName);
    return cookie ? cookie.value : null;
}