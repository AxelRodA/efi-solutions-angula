import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  modules = [
    { icon: 'date_range', text: 'Chronograma', link: '/schedules' },
    { icon: 'engineering', text: 'Tecnicos', link: '/technicians' },
    { icon: 'account_balance_wallet', text: 'Gastos', link: '/expenses' },
    { icon: 'store', text: 'Sucursales', link: '/offices' },
    { icon: 'people_alt', text: 'Contactos', link: '/contacts' },
    { icon: 'local_shipping', text: 'Vehiculos', link: '/vehicles' },
    { icon: 'construction', text: 'Servicios', link: '/' },
  ];
  constructor() {}

  ngOnInit(): void {}
}
