import { Component, OnInit } from '@angular/core';

import { Hero } from './hero'; 
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { Result } from '../interfaces/heroes.interface';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  selectedHero?: Result;

  heroes: Result[] = [];

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Result): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    
    this.heroService.getAllHeroes()
        .subscribe(heroes => this.heroes = heroes.data.results);
  }

  getPaginado(e:PageEvent): void {
    const offset = e.pageIndex * e.pageSize ;
    this.heroService.getTotalHeroes(offset)
        .subscribe(heroes => this.heroes = heroes.data.results);
  }
  getSiguiente(offset= 0): void {
    //const offset = this.heroes.length;
    this.heroService.getTotalHeroes(offset)
        .subscribe(heroes => this.heroes = heroes.data.results);
  }

  /*add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }*/
}
