'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-responsivemenu documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ResponsiveMenuModule.html" data-type="entity-link">ResponsiveMenuModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' : 'data-target="#xs-components-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' :
                                            'id="xs-components-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                            <li class="link">
                                                <a href="components/ResponsiveMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResponsiveMenuComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' : 'data-target="#xs-directives-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' :
                                        'id="xs-directives-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                        <li class="link">
                                            <a href="directives/MenuItemDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuItemDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/MenuToggleDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuToggleDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/OverflowContentDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">OverflowContentDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' : 'data-target="#xs-injectables-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' :
                                        'id="xs-injectables-links-module-ResponsiveMenuModule-ee055fb01060e3d6a1915953fcaf40a7"' }>
                                        <li class="link">
                                            <a href="injectables/OverflowControl.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OverflowControl</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AsyncEvent.html" data-type="entity-link">AsyncEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/OverflowModel.html" data-type="entity-link">OverflowModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});