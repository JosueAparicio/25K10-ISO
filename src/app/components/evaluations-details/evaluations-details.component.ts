import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PruebaService } from '../../services/prueba.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ViewEvaluationComponent } from '../dialogs/view-evaluation/view-evaluation.component';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluations-details',
  templateUrl: './evaluations-details.component.html',
  styleUrls: ['./evaluations-details.component.css'],
  providers: [PruebaService]

})
export class EvaluationsDetailsComponent implements OnInit {
  public creator: any;
  public id: any;
  public ev: any;
  public evaluation: any;
  public usuario: any;
  public url: any;
  public thus : any =0;
  public husc : any =0;
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

  public barChartData: ChartDataSets[] = [
    { data: [], label: '% obtenido' },
  ];
  public ChartColors = [
    {
      backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(137, 255, 0, 1)', 'rgba(0, 0, 255, 1)','rgb(255, 99, 71)', 'rgb(64, 224, 208)', 'rgb(0, 0, 128)', 'rgb(255, 20, 147)', 'rgb(199, 21, 133)'],
    },
  ]
  constructor(private _route: ActivatedRoute, private _router: Router, private auth2: PruebaService,  private fb: FormBuilder, public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    moment.locale('es')
    this.creator = this._route.snapshot.paramMap.get('creator');
    this.id = this._route.snapshot.paramMap.get('project');
    this.ev = this._route.snapshot.paramMap.get('evaluation');
    const user = await this.auth2.getCurrentUser();

    if (user) {
      this.url = `view-project/${this.creator}/${this.id}`;
      this.usuario = user;
      this.auth2.getEvaluation(this.creator, this.id, this.ev).subscribe(data=>{
        this.evaluation = data;
        this.evaluation.fecha = moment(this.evaluation.fecha).fromNow();
        this.evaluation.caracteristicas.forEach((element, index) => {
          this.barChartData[0].data[index] = element.porcentaje;
          this.barChartLabels[index] = element.nombre;
          element.subs.forEach(row => {
            this.thus += row.hus;
            this.husc += row.husc;
            
          });
        });          
          
      })
    } else {
      this._router.navigate(['/auth/login']);
    }



  }

  detalles(cat){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100%';
    dialogConfig.height = '90%';
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = cat;
   const ref = this.dialog.open(ViewEvaluationComponent, dialogConfig);
    ref.afterClosed().subscribe(async res => {
      //console.log(res);

  })
  }

  porcentaje(sub, total){
    
    return Math.round((sub / total) * 100);
    
  }
}
