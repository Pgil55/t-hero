import { Injectable } from '@angular/core';
import { Hero } from './heroes/hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Heroes, Result } from './interfaces/heroes.interface';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private Url: string = ' http://gateway.marvel.com/v1/public/characters';
  private api:string = 'ts=patata&apikey=53557f0a483061ca4166329dfafcb05a&hash=6c2dc921a3de99a5837944f4f9e8579b';



  constructor(private messageService: MessageService,
    private http: HttpClient,
    
    
    
    
    ) { }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
    getAllHeroes(): Observable<Heroes> {
      return this.http.get<Heroes>(this.Url +'?' +this.api)
        .pipe(map((data: Heroes  ) =>data)); 
        
    }
    getRandomHeroes(): Observable<Heroes> {
      const random = Math.random() * 1562;
      const url = `${this.Url}?offset=${random}&${this.api}`;
      return this.http.get<Heroes>(url)
        .pipe(map((data: Heroes  ) =>data)); 
        
    }
  
    getTotalHeroes(offset:number): Observable<Heroes> {

      const url = `${this.Url}?offset=${offset}&${this.api}`;

      return this.http.get<Heroes>(url)
      .pipe(
        map((data: Heroes)  => data)
        
      );
    }

    
  /*getAll(): Observable[] {
    return HEROES;
  }*/

  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    return heroes;
  }*/
  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }*/
  /*getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    return heroes;
  }*/
  /** GET heroes from the server */
/*getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
}*/
/*getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}*/
/** GET heroes from the server */
getHeroes(): Observable<Hero[]> {
  return this.http.get<Hero[]>(this.Url)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
}
/** GET hero by id. Will 404 if id not found */
getHero(id: number): Observable<Heroes> {
  const url = `${this.Url}/${id}?${this.api}`;
  return this.http.get<Heroes>(url).pipe(
    tap(_ => this.log(`fetched hero id=${id}`)),
    catchError(this.handleError<Heroes>(`getHero id=${id}`))
  );
}
  /*getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }*/

  /** PUT: update the hero on the server */
updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}
  /** Log a HeroService message with the MessageService */
private log(message: string) {
  this.messageService.add(`HeroService: ${message}`);
}
private heroesUrl = 'api/heroes';  // URL to web api

/** POST: add a new hero to the server */
addHero(hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}
/** DELETE: delete the hero from the server */
deleteHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Result[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of();
    }
    return this.http.get<Heroes>(`${this.Url}?${this.api}&nameStartsWith=${term}&limit=5`).pipe(
      map((data:Heroes)=> {
        console.log(data.data.results);
        return data.data.results;
      }))
      /*tap(x => x ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Result>('searchHeroes'))
    );*/
  }

/**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}
