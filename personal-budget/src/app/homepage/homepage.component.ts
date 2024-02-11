import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject} from '@angular/core';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {

  public dataSource: ChartConfiguration['data'] = {
    datasets: [{
      data: [],
      backgroundColor: [
        '#ffcd56',
        '#ff6384',
        '#36a2eb',
        '#fd6b19',
        '#8e5ea2',
        '#3cba9f',
        '#e8c3b9',
        '#c45850',  
      ]
    }],
    labels: [] // Make it an empty array
  };
  
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId :any) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
    for (let i = 0; i < res.myBudget.length; i++) {
      this.dataSource.datasets[0].data.push(res.myBudget[i].budget);
      this.dataSource.datasets.push(res.myBudget[i].title); // Add type assertion
    }
    this.createChart();
  });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart()
    }, 1000);
  }

  createChart(): void {
    if(isPlatformBrowser(this.platformId)){
      const ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    }

  }
}
