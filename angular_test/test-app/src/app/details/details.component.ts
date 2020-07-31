import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  detailHidden = true;
  clicks = [];

  constructor() { }

  ngOnInit(): void {
  }

  onDetailClick(): void {
    this.detailHidden = !this.detailHidden;
    //this.clicks.push(this.clicks.length + 1);
    this.clicks.push(new Date());
  }
}
