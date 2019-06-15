#### 1.0.4 (2019-06-15)

##### New Features

* **lib:**
  *  dont remove overflow if beforeRemove has been canceled [closes#47] (1223b8ff)
  *  dont render overflow after beforeRender has been canceled [closes#46] (37cf4c3e)
  *  add option to append class to default overflow container [closes#31] (f1e3a068)
* **testing:**  complete unit tests responsive menu component [closes#43] (3c72c247)
* **example:**
  *  add example for async operations [closes#23] (beb9cfdf)

##### Bug Fixes

* **lib:**
  *  fixed bug overflow allways rendered [closes#42] (06204374)
* **docs:**  docs should show now correct header [closes#38] (f0396319)

##### Other Changes

*  add custom toggle example (b7e92a05)
*  update documentation (d8c907fa)
*  clean up code (5ff05616)

#### 1.0.2 (2019-06-11)

##### New Features

* **lib:**
  *  add option to append class to default overflow container [closes#31] (f1e3a068)
* **example:**
  *  add example for async operations [closes#23] (beb9cfdf)

##### Bug Fixes

* **docs:**  docs should show now correct header [closes#38] (f0396319)


## 1.0.0 (2019-06-10)

##### New Features

* **lib:**
  *  create readme file [closes#18] (44c7edf1)
  *  change selector ngx-responsivemenu-content to ngx-responsivemenu-overflow [closes#26] (57d42f7f)
  *  change spelling renderOverflow to customOverflow [closes#25] (7e44d2be)
  *  add option to set class to button pane [closes#21] (6d71781b)
  *  add option to responsive menu component to force overflow [closes#20] (6aae1472)
  *  remove overflow template/container logic [closes#19] (0c07dc5e)
  *  add property to align more button [closes#12] (996bea34)
  *  add directive to define custom more button [closes#9] (966dc14d)
  *  add visible property if this is false it will allways render to overflow [closes#1] (366710f0)
  *  add possibility to define custom template [closes#3] feat(lib): add possibility to define custom entry point [closes#8] (5fb64cac)
  *  create library for ngx-responsive menu [closes#5] (30d1eb83)
* **example:**
  *  change style resize container [closes#28] (747c1c95)
  *  added example for overflow content directive [closes#22] (2d3503d5)
  *  add force overflow example [closes#24] (7b08bdba)
  *  add example for more complex items [closes#4] (5d485c98)
  *  add tile to show examples, add simple example [closes#14] (ca56a482)

##### Bug Fixes

* **lib:**
  *  calculate parent width excluding padding and border [closes#36] (72871de6)
  *  default toggle button added multiple times [closes#16] (bb56ba18)
  *  fixed bug possible overflow items allways rendered to to overflow [closes#15] (c86a400b)
  *  fix bug content width calculated wrong [closes#11] (d2383c83)
  *  inline style should override scss style only if required [closes#10] (6b05ae17)

##### Other Changes

*  add custom toggle example (b7e92a05)
*  update documentation (d8c907fa)
*  clean up code (5ff05616)
