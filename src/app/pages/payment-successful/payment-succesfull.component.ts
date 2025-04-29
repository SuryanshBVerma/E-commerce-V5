import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { LucideAngularModule, CircleCheck, Router } from 'lucide-angular';

@Component({
  selector: 'app-payment-successful',
  imports: [
    LucideAngularModule,
  ],
  templateUrl: './payment-successful.component.html',
})
export class PaymentSuccessfulComponent {
  readonly success = CircleCheck;
  @Input() transactionId: string = 'default';
  @Input() showModal : boolean = false;

  ngOnInit(){
    if(this.showModal){
      this.fireConfetti();
    }
  }


  closeModal() {
    this.showModal = false;
  }


  private fireConfetti() {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      spread: 70,
      startVelocity: 60
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    // Fire confetti in different directions
    fire(0.25, { spread: 26 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }

}
