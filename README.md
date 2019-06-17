# Ngx-Responsivemenu

[![npm](https://img.shields.io/npm/v/ngx-responsivemenu.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/ngx-responsivemenu)
[![CircleCI](https://circleci.com/gh/r-hannuschka/ngx-responsivemenu/tree/master.svg?style=svg)](https://circleci.com/gh/r-hannuschka/ngx-responsivemenu/tree/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e4971022c6b04c4cb08aff9894544d81)](https://app.codacy.com/app/r-hannuschka/ngx-responsivemenu?utm_source=github.com&utm_medium=referral&utm_content=r-hannuschka/ngx-responsivemenu&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/r-hannuschka/ngx-responsivemenu/branch/master/graph/badge.svg)](https://codecov.io/gh/r-hannuschka/ngx-responsivemenu)
[![documentation](https://r-hannuschka.github.io/ngx-responsivemenu/documentation/images/coverage-badge-documentation.svg)](https://r-hannuschka.github.io/ngx-responsivemenu/documentation)
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
        this.items = Array.from( Array.from({length: 10 } ), ( v, index ) => `Item #${ index }`);
    }
}
```

### app.component.html

```html
<ngx-responsivemenu>
    <div ngxResponsiveMenuItem *ngFor="let item of items">{{item}}</div>
</ngx-responsivemenu
```

more [Examples](https://r-hannuschka.github.io/ngx-responsivemenu/#/examples)

## Documentation

Documentation will be auto generated with [Compodoc](https://compodoc.app/) and can found [here](https://r-hannuschka.github.io/ngx-responsivemenu/documentation/).

## Development

```bash
git clone git@github.com:r-hannuschka/ngx-responsivemenu.git
cd ngx-responsivemenu\src && npm i
ng serve
```

## Generate Docs

```bash
npm run compodoc
```

## Author

Ralf Hannuschka
