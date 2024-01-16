export abstract class FrontendDbService {
  protected apiPath: string;

  constructor(apiPath: string) {
    this.apiPath = apiPath;
  }

  protected async fetchData(endpoint: string): Promise<any> {
    const response = await fetch(this.apiPath + endpoint);
    return response.json();
  }

  abstract getAllData(): Promise<any>;
}
