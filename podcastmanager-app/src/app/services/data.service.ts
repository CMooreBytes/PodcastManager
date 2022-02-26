import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { InterpolationConfig } from '@angular/compiler';

export interface Episode {
  episode_id: number;
  show_id: number;
  title: string;
  info_url: string; 
  media_url: string;
  description: string;
  created_on: any;
}

export interface Show {
  show_id: number;
  title: string;
  url: string;
  description: string;
  imageUrl: string;
  created_on: any;
  show_episodes: Episode[];
}

@Injectable()
export class DataService {
  BASEURL = 'localhost:3000';
  constructor(private http: HttpClient) {
    this.http = http;
  }

  getEpisodes(): Observable<Show[]> {
    return this.http.get<Show[]>(`http://${this.BASEURL}/`)
  }
}