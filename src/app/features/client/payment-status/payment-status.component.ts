import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  status$: Observable<'sucesso' | 'falha' | 'pendente'>;

  constructor(private route: ActivatedRoute) {
    this.status$ = this.route.paramMap.pipe(
      map(params => params.get('status') as 'sucesso' | 'falha' | 'pendente')
    );
  }

  ngOnInit(): void {
    this.status$.subscribe(status => {
      if (status === 'falha') {
        alert('Ocorreu um problema com o seu pagamento. Por favor, tente novamente.');
      }
    });
  }
}
