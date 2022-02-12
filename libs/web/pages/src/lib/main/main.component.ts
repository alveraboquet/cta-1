import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { pages } from '../pages';
import {NzSiderComponent} from "ng-zorro-antd/layout";

@Component({
  selector: 'cta-web-pages-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MainComponent {
  pages = pages;
  @ViewChild(NzSiderComponent) sider?: NzSiderComponent;

  get isMenuCollapsed(): boolean {
    return !!this.sider?.nzCollapsed;
  }
}
