import { Bored } from "./bored.interface";
import { from, Observable } from "rxjs";

class BoredApi {

  fetchBored(data: { min: number, max: number }): Observable<Bored> {
    const url = `http://www.boredapi.com/api/activity?minparticipants=${data.min}&maxparticipants=${data.max}`;
    return from(fetch(url).then(res => res.json()));
  }

}

export const boredApi = new BoredApi();
