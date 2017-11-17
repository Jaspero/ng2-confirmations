import {Component, HostBinding, NgZone, ViewEncapsulation} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ResolveEmit} from '../../interfaces/resolve-emit';

@Component({
    selector: 'jaspero-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('overlayAn', [
            state('void', style({opacity: 0})),
            state('leave', style({opacity: 0})),
            state('enter', style({opacity: 1})),
            transition('void => enter', animate('400ms cubic-bezier(.25,.8,.25,1)')),
            transition('enter => leave', animate('400ms cubic-bezier(.25,.8,.25,1)'))
        ]),
        trigger('wrapperAn', [
            state('void', style({opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)'})),
            state('leave', style({opacity: 0, transform: 'scale(0.75, 0.75) translate(0, 0)'})),
            state('enter', style({opacity: 1, transform: 'scale(1, 1) translate(0, 0)'})),
            transition('void => enter', animate('450ms cubic-bezier(.5, 1.4, .5, 1)')),
            transition('enter => leave', animate('450ms cubic-bezier(.5, 1.4, .5, 1)'))
        ])
    ]
})
export class ConfirmationComponent {
    constructor(
        private _ngZone: NgZone
    ) {}

    @HostBinding('class.jaspero__confirmation') true;

    animationState = 'enter';
    incomingData: any = {
        title: '',
        titleIsTemplate: false,
        message: '',
        messageIsTemplate: false,
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        confirmText: 'Yes',
        confirmTextIsTemplate: false,
        declineText: 'No',
        declineTextIsTemplate: false,
        resolve$: null
    };

    overlayClick() {
        if (!this.incomingData.overlayClickToClose) {
            return;
        }

        this.close('overlayClick');
    }

    close(type: string) {
        this.animationState = 'leave';
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this._ngZone.run(() => {
                    this.resolve({closedWithOutResolving: type});
                });
            }, 450);
        });
    }

    resolve(how: ResolveEmit) {
        this.animationState = 'leave';
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this._ngZone.run(() =>  {
                    this.incomingData.resolve$.next(how);
                });
            }, 450);
        });
    }
}