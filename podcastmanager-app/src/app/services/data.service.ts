import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Episode {
  episode_id: number;
  show_id: number;
  title: string;
  info_url: string; 
  media_url: string;
  description: string;
  created_on: any
}

@Injectable()
export class DataService {
  BASEURL = 'localhost:3000';
  constructor(private http: HttpClient) {
    this.http = http;
  }

  getEpisodes(): Observable<Episode[]> {
    return this.http.get<Episode[]>(`http://${this.BASEURL}/`)
  }
}