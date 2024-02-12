import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  @ViewChild('d3Chart', { static: true }) private d3ChartContainer!: ElementRef;

  
  public dataSource: ChartConfiguration['data'] = {
    datasets: [{
      data: [] as number[],
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
    labels: [] as string[] // Make it an empty array
  };
  
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    this.http.get<any>('server/new.json')
      .subscribe(data => {
        if (data) {
          for (const item of data) {
            this.dataSource.datasets[0].data.push(item.budget);
        //    this.dataSource.labels.push(item.title);
          }
          this.createChart();
          this.createD3Chart(data);
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
     // this.createD3Chart(this.dataSource.labels);
    }, 1000);
  }

  createChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    }
  }

  createD3Chart(data: any[]): void {
    if (isPlatformBrowser(this.platformId)) {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 },
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

      const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .range([height, 0]);

      const svg = d3.select(this.d3ChartContainer.nativeElement)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      x.domain(data.map(d => d.title));
      y.domain([0, d3.max(data, d => d.budget)!]); 

      svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
       // .attr('x', (d: any) => x(d.title).toString())
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.budget)!)
        .attr('height', d => height - y(d.budget)!)
       // .attr('fill', (d, i) => this.dataSource.datasets[0].backgroundColor?.[i] as string);

      svg.selectAll('.bar-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'bar-label')
        //.attr('x', d => x(d.title) + x.bandwidth() / 2)
        .attr('y', d => y(d.budget)! - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.title);
    }
  }
}

