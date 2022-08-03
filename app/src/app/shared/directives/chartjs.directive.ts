import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';

@Directive({
  selector: '[appChartjs]'
})
export class ChartjsDirective {
  @Input() type: string;
  @Input() data: any;
  @Input() options: any;

  @Output() chartjs: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {
    this.type = this.type || 'bar';
  }

  ngOnChanges() {
    let chart = new Chart(this.el.nativeElement, {
      data: this.data,
      type: this.type,
      options: this.options // or 'line', 'scatter', 'pie', 'percentage'
    });
    this.chartjs.emit(chart);
  }

}