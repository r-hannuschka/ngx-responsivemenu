# Ngx-Responsivemenu

![documentation](https://r-hannuschka.github.io/ngx-responsivemenu/src/documentation/images/coverage-badge-documentation.svg)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

Angular 8+ Responsive Menu
___

## Installation

npm

```bash
npm i --save ngx-responsivemenu
```

## Usage

### app.module.ts

```ts
// App Module
import { ResponsiveMenuModule } from "ngx-responsivemenu";
import { AppComponent } from "./app.component";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        ResponsiveMenuModule,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor() { }
}
```

### app.component.ts

```ts

// AppComponent
import { Component, OnInit } from "@angular/core";
import { OverflowControl, ResponsiveMenuComponent } from "ngx-responsivemenu";

@Component({
    selector: "app-component",
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"],
    viewProviders: [OverflowControl]
})
export class SimpleExampleComponent implements OnInit {

    public style;

    public items: string[] = [];

    ngOnInit() {
        /** create array with 10 items */
        this.items = Array.from( Array.from( { length: 10 } ), ( v, index ) => `Item #${ index }` );
    }
}
```

### app.component.html

```html
<ngx-responsivemenu>
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
</ngx-responsivemenu
```

more [examples](https://r-hannuschka.github.io/ngx-responsivemenu/src/demo/#/examples) can be found here

## Documentation

Documentation will be auto generated with [Compodoc](https://compodoc.app/) and can found [here](https://r-hannuschka.github.io/ngx-responsivemenu/src/documentation/).

## Development

```bash
git clone git@github.com:r-hannuschka/ngx-responsivemenu.git
cd ngx-responsivemenu\src && npm i
ng build ngx-responsivemenu
ng serve
```

## Generate Docs

```bash
npm run compodoc
```

## Author

Ralf Hannuschka
