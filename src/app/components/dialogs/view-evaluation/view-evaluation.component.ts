import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PruebaService } from '../../../services/prueba.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-view-evaluation',
  templateUrl: './view-evaluation.component.html',
  styleUrls: ['./view-evaluation.component.css'],
  providers: [PruebaService]
})
export class ViewEvaluationComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public left : string = '69';
  public status : string;
  public thus : number = 0;
  public thusc : number = 0;
  public barChartData: ChartDataSets[] = [
    { data: [], label: '% obtenido' },
  ];
  public ChartColors = [
    {
      backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(137, 255, 0, 1)', 'rgba(0, 0, 255, 1)','rgb(255, 99, 71)', 'rgb(64, 224, 208)', 'rgb(0, 0, 128)', 'rgb(255, 20, 147)', 'rgb(199, 21, 133)'],
    },
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<ViewEvaluationComponent>, private auth2: PruebaService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    
    this.data.porcentaje = Math.round(this.data.porcentaje * 100) / 100;
    this.data.sumacat = Math.round(this.data.sumacat * 100) / 100;
    this.data.total = Math.round(this.data.total * 100) / 100;
    this.data.subtotal = Math.round(this.data.subtotal * 100) / 100;


    this.obStatus();
    this.data.subs.forEach((element, index) => {
      this.barChartData[0].data[index] = Math.round((element.total / this.data.subtotal) * 100);
      this.barChartLabels[index] = element.nombre;
      this.data.subs[index].thus = Math.round(element.thus * 100) / 100;
      this.data.subs[index].total = Math.round(element.total * 100) / 100;
      this.thus += element.hus;
      this.thusc += element.husc;

    });
    if (this.data.nombre.length > 14){
      this.left = '60';
    }
  }

  onClose() {
    this.dialogRef.close();
  }

    // events

  obStatus(){
    if (this.data.porcentaje  <= 49){
      this.status = 'Deficiente'
    } else if (this.data.porcentaje >= 50 && this.data.porcentaje <= 74){
      this.status = 'Regular'
    } else if (this.data.porcentaje >= 75 && this.data.porcentaje <= 89){
      this.status = 'Acceptable'
    } else if (this.data.porcentaje >= 90 && this.data.porcentaje <= 94){
      this.status = 'Bueno'
    } else if (this.data.porcentaje >= 95 && this.data.porcentajel <= 100){
      this.status = 'Muy bueno'
    }
  }
  porcentaje(total, sub){
    return Math.round((total / sub) * 100);
  }
}
