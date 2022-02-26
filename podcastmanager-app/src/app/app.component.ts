import { Component, OnInit } from '@angular/core';
import { DataService, Show, Episode } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'podcastmanager-app';
  shows: Show[] = [];

  constructor(private dataService: DataService) {
    this.dataService = dataService;
  }

  getEpisodes(): void {
    this.dataService.getEpisodes()
      .subscribe((shows: Show[]) => this.shows = shows)
  }

  ngOnInit(): void {
    this.getEpisodes();
  }
}
