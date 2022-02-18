import { Component, OnInit } from '@angular/core';
import { DataService, Episode } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'podcastmanager-app';
  episodes: Episode[] = [];

  constructor(private dataService: DataService) {
    this.dataService = dataService;
  }

  getEpisodes(): void {
    this.dataService.getEpisodes()
      .subscribe((episodes: Episode[]) => this.episodes = episodes)
  }

  ngOnInit(): void {
    this.getEpisodes();
  }
}
