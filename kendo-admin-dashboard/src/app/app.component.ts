import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kendo-admin-dashboard';

  public employees: any[] = [
    { name: 'Pesho', position: 'Developer', salary: 5000 },
    { name: 'Gosho', position: 'Designer', salary: 6000 },
    // TODO Add more employee objects as needed
  ];
}
