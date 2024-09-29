import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Train Seat Reservation System</h1>
    <div>
      <label for="seats">Number of seats to reserve: </label>
      <input type="number" id="seats" [(ngModel)]="seatsToReserve" min="1" max="7">
      <button (click)="reserveSeats()">Reserve</button>
    </div>
    <p>{{ reservationMessage }}</p>
    <div *ngFor="let row of seatLayout; let i = index">
      <span *ngFor="let seat of row; let j = index"
            [style.background-color]="seat ? 'green' : 'red'"
            style="display: inline-block; width: 20px; height: 20px; margin: 2px;">
        {{ i * 7 + j + 1 }}
      </span>
    </div>
  `,
  styles: [`
    :host { font-family: Arial, sans-serif; }
    input, button { margin: 5px; }
  `]
})
export class AppComponent {
  seatLayout: boolean[][] = [];
  seatsToReserve = 1;
  reservationMessage = '';

  constructor() {
    this.initializeSeatLayout();
  }

  initializeSeatLayout() {
    for (let i = 0; i < 11; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < (i === 10 ? 3 : 7); j++) {
        row.push(Math.random() > 0.3);
      }
      this.seatLayout.push(row);
    }
  }

  reserveSeats() {
    if (this.seatsToReserve < 1 || this.seatsToReserve > 7) {
      this.reservationMessage = 'Please enter a number between 1 and 7.';
      return;
    }

    const reservedSeats = this.findAndReserveSeats(this.seatsToReserve);
    if (reservedSeats.length > 0) {
      this.reservationMessage = `Seats reserved: ${reservedSeats.join(', ')}`;
    } else {
      this.reservationMessage = 'Sorry, no seats available for the requested number.';
    }
  }

  findAndReserveSeats(count: number): number[] {
    const reservedSeats: number[] = [];

    for (let i = 0; i < this.seatLayout.length; i++) {
      const availableSeats = this.findAvailableSeatsInRow(i, count);
      if (availableSeats.length === count) {
        this.reserveSeatsInRow(i, availableSeats);
        return availableSeats.map(j => i * 7 + j + 1);
      }
    }

    return reservedSeats;
  }

  findAvailableSeatsInRow(rowIndex: number, count: number): number[] {
    const availableSeats: number[] = [];
    for (let j = 0; j < this.seatLayout[rowIndex].length; j++) {
      if (this.seatLayout[rowIndex][j]) {
        availableSeats.push(j);
        if (availableSeats.length === count) {
          return availableSeats;
        }
      } else {
        availableSeats.length = 0;
      }
    }
    return [];
  }

  reserveSeatsInRow(rowIndex: number, seats: number[]) {
    for (const seat of seats) {
      this.seatLayout[rowIndex][seat] = false;
    }
  }
}