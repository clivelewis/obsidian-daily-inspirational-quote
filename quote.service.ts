interface Quote {
	author: string;
	content: string;
}

export class QuoteService {
    
    private static API_PATH: string = "https://api.quotable.io/random?tags=inspirational";

	static async getRandomInspirationalQuote(): Promise<Quote> {
		
        const response = await fetch(this.API_PATH);
        const data = await response.text();
        return JSON.parse(data);
	}
}
