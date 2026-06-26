# Changelog

## [0.9.1-next.2](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.9.1-next.1...tools-core-v0.9.1-next.2) (2026-06-26)


### Features

* add 'byte' to supported json-schema format values ([#122](https://github.com/iotaledger/twin-tools/issues/122)) ([54c2a27](https://github.com/iotaledger/twin-tools/commit/54c2a279c1fdc4f6779667e3deb3de3a199237ac))
* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add examples to json schema ([#109](https://github.com/iotaledger/twin-tools/issues/109)) ([def5b13](https://github.com/iotaledger/twin-tools/commit/def5b1312e7a0ffefe662fb14575cb655d1c0774))
* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))
* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))
* add json-schema embedded mode ([#102](https://github.com/iotaledger/twin-tools/issues/102)) ([f070967](https://github.com/iotaledger/twin-tools/commit/f070967f8f3308e0b5320eab278a319c9d229e3e))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))
* improve inheritance redefinition optionality ([e7024f6](https://github.com/iotaledger/twin-tools/commit/e7024f699988c0b3de8315a0dbe455a13268e75d))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))
* typescript 6 update ([02d2e47](https://github.com/iotaledger/twin-tools/commit/02d2e47859a1d64c81e840626cc2d443816af45b))
* update dependencies ([5bdd8be](https://github.com/iotaledger/twin-tools/commit/5bdd8becf9f08b35342ea8f298f74578951f4bac))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))
* use correct json-ld context schema ([c831486](https://github.com/iotaledger/twin-tools/commit/c8314864a63635556cd5f2912162a2989056e974))
* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))
* ajv stack overflow for oneOf on large enums ([#112](https://github.com/iotaledger/twin-tools/issues/112)) ([6be32a3](https://github.com/iotaledger/twin-tools/commit/6be32a3ae5b3cf188c0d1caf1080f497b648705c))
* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))
* missing type definitions when importing relative from dynamic node_modules ([52d9fc5](https://github.com/iotaledger/twin-tools/commit/52d9fc5f2618a09c02b9f5dbe585b37cf60c9f20))
* module resolution ([f3aa10c](https://github.com/iotaledger/twin-tools/commit/f3aa10c9c9af073de392a2ef6b8411e947e991c2))
* remove byte support ([#124](https://github.com/iotaledger/twin-tools/issues/124)) ([7f8c9cd](https://github.com/iotaledger/twin-tools/commit/7f8c9cd4dcc49c58ccc9a985f5bcd03736b5ef0f))
* support json-ld with aliases type ([#127](https://github.com/iotaledger/twin-tools/issues/127)) ([1eb6c4f](https://github.com/iotaledger/twin-tools/commit/1eb6c4f00088955506c88f026cfaba6e1e1a61b7))
* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.9.1-next.1 to 0.9.1-next.2

## [0.9.1-next.1](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.9.1-next.0...tools-core-v0.9.1-next.1) (2026-06-26)


### Features

* add 'byte' to supported json-schema format values ([#122](https://github.com/iotaledger/twin-tools/issues/122)) ([54c2a27](https://github.com/iotaledger/twin-tools/commit/54c2a279c1fdc4f6779667e3deb3de3a199237ac))
* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add examples to json schema ([#109](https://github.com/iotaledger/twin-tools/issues/109)) ([def5b13](https://github.com/iotaledger/twin-tools/commit/def5b1312e7a0ffefe662fb14575cb655d1c0774))
* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))
* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))
* add json-schema embedded mode ([#102](https://github.com/iotaledger/twin-tools/issues/102)) ([f070967](https://github.com/iotaledger/twin-tools/commit/f070967f8f3308e0b5320eab278a319c9d229e3e))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))
* improve inheritance redefinition optionality ([e7024f6](https://github.com/iotaledger/twin-tools/commit/e7024f699988c0b3de8315a0dbe455a13268e75d))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))
* typescript 6 update ([02d2e47](https://github.com/iotaledger/twin-tools/commit/02d2e47859a1d64c81e840626cc2d443816af45b))
* update dependencies ([5bdd8be](https://github.com/iotaledger/twin-tools/commit/5bdd8becf9f08b35342ea8f298f74578951f4bac))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))
* use correct json-ld context schema ([c831486](https://github.com/iotaledger/twin-tools/commit/c8314864a63635556cd5f2912162a2989056e974))
* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))
* ajv stack overflow for oneOf on large enums ([#112](https://github.com/iotaledger/twin-tools/issues/112)) ([6be32a3](https://github.com/iotaledger/twin-tools/commit/6be32a3ae5b3cf188c0d1caf1080f497b648705c))
* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))
* missing type definitions when importing relative from dynamic node_modules ([52d9fc5](https://github.com/iotaledger/twin-tools/commit/52d9fc5f2618a09c02b9f5dbe585b37cf60c9f20))
* module resolution ([f3aa10c](https://github.com/iotaledger/twin-tools/commit/f3aa10c9c9af073de392a2ef6b8411e947e991c2))
* remove byte support ([#124](https://github.com/iotaledger/twin-tools/issues/124)) ([7f8c9cd](https://github.com/iotaledger/twin-tools/commit/7f8c9cd4dcc49c58ccc9a985f5bcd03736b5ef0f))
* support json-ld with aliases type ([#127](https://github.com/iotaledger/twin-tools/issues/127)) ([1eb6c4f](https://github.com/iotaledger/twin-tools/commit/1eb6c4f00088955506c88f026cfaba6e1e1a61b7))
* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.9.1-next.0 to 0.9.1-next.1

## [0.9.0](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.9.0...tools-core-v0.9.0) (2026-06-22)


### Features

* release to production ([ad24b7e](https://github.com/iotaledger/twin-tools/commit/ad24b7eb16784165b6c93b5c48788199f0e17526))
* release to production ([#119](https://github.com/iotaledger/twin-tools/issues/119)) ([cc2828a](https://github.com/iotaledger/twin-tools/commit/cc2828a6c68466bfdeaf75b507bc980dddac2cf0))
* release to production ([#134](https://github.com/iotaledger/twin-tools/issues/134)) ([2761a5d](https://github.com/iotaledger/twin-tools/commit/2761a5d6cc7ffb32fd3273446191e41b7052e627))
* release to production ([#137](https://github.com/iotaledger/twin-tools/issues/137)) ([350bac3](https://github.com/iotaledger/twin-tools/commit/350bac331b587ff396f527f2f3b932736f547342))
* release to production ([#141](https://github.com/iotaledger/twin-tools/issues/141)) ([d46568c](https://github.com/iotaledger/twin-tools/commit/d46568c8335c120deb3ba2e83133e208471c4eb0))

## [0.9.0-next.1](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.9.0-next.0...tools-core-v0.9.0-next.1) (2026-06-22)


### Features

* add 'byte' to supported json-schema format values ([#122](https://github.com/iotaledger/twin-tools/issues/122)) ([54c2a27](https://github.com/iotaledger/twin-tools/commit/54c2a279c1fdc4f6779667e3deb3de3a199237ac))
* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add examples to json schema ([#109](https://github.com/iotaledger/twin-tools/issues/109)) ([def5b13](https://github.com/iotaledger/twin-tools/commit/def5b1312e7a0ffefe662fb14575cb655d1c0774))
* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))
* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))
* add json-schema embedded mode ([#102](https://github.com/iotaledger/twin-tools/issues/102)) ([f070967](https://github.com/iotaledger/twin-tools/commit/f070967f8f3308e0b5320eab278a319c9d229e3e))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))
* improve inheritance redefinition optionality ([e7024f6](https://github.com/iotaledger/twin-tools/commit/e7024f699988c0b3de8315a0dbe455a13268e75d))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))
* typescript 6 update ([02d2e47](https://github.com/iotaledger/twin-tools/commit/02d2e47859a1d64c81e840626cc2d443816af45b))
* update dependencies ([5bdd8be](https://github.com/iotaledger/twin-tools/commit/5bdd8becf9f08b35342ea8f298f74578951f4bac))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))
* use correct json-ld context schema ([c831486](https://github.com/iotaledger/twin-tools/commit/c8314864a63635556cd5f2912162a2989056e974))
* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))
* ajv stack overflow for oneOf on large enums ([#112](https://github.com/iotaledger/twin-tools/issues/112)) ([6be32a3](https://github.com/iotaledger/twin-tools/commit/6be32a3ae5b3cf188c0d1caf1080f497b648705c))
* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))
* missing type definitions when importing relative from dynamic node_modules ([52d9fc5](https://github.com/iotaledger/twin-tools/commit/52d9fc5f2618a09c02b9f5dbe585b37cf60c9f20))
* module resolution ([f3aa10c](https://github.com/iotaledger/twin-tools/commit/f3aa10c9c9af073de392a2ef6b8411e947e991c2))
* remove byte support ([#124](https://github.com/iotaledger/twin-tools/issues/124)) ([7f8c9cd](https://github.com/iotaledger/twin-tools/commit/7f8c9cd4dcc49c58ccc9a985f5bcd03736b5ef0f))
* support json-ld with aliases type ([#127](https://github.com/iotaledger/twin-tools/issues/127)) ([1eb6c4f](https://github.com/iotaledger/twin-tools/commit/1eb6c4f00088955506c88f026cfaba6e1e1a61b7))
* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.9.0-next.0 to 0.9.0-next.1

## [0.0.4-next.3](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.4-next.2...tools-core-v0.0.4-next.3) (2026-06-02)


### Bug Fixes

* support json-ld with aliases type ([#127](https://github.com/iotaledger/twin-tools/issues/127)) ([1eb6c4f](https://github.com/iotaledger/twin-tools/commit/1eb6c4f00088955506c88f026cfaba6e1e1a61b7))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.4-next.2 to 0.0.4-next.3

## [0.0.4-next.2](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.4-next.1...tools-core-v0.0.4-next.2) (2026-06-01)


### Bug Fixes

* remove byte support ([#124](https://github.com/iotaledger/twin-tools/issues/124)) ([7f8c9cd](https://github.com/iotaledger/twin-tools/commit/7f8c9cd4dcc49c58ccc9a985f5bcd03736b5ef0f))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.4-next.1 to 0.0.4-next.2

## [0.0.4-next.1](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.4-next.0...tools-core-v0.0.4-next.1) (2026-05-29)


### Features

* add 'byte' to supported json-schema format values ([#122](https://github.com/iotaledger/twin-tools/issues/122)) ([54c2a27](https://github.com/iotaledger/twin-tools/commit/54c2a279c1fdc4f6779667e3deb3de3a199237ac))
* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add examples to json schema ([#109](https://github.com/iotaledger/twin-tools/issues/109)) ([def5b13](https://github.com/iotaledger/twin-tools/commit/def5b1312e7a0ffefe662fb14575cb655d1c0774))
* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))
* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))
* add json-schema embedded mode ([#102](https://github.com/iotaledger/twin-tools/issues/102)) ([f070967](https://github.com/iotaledger/twin-tools/commit/f070967f8f3308e0b5320eab278a319c9d229e3e))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))
* improve inheritance redefinition optionality ([e7024f6](https://github.com/iotaledger/twin-tools/commit/e7024f699988c0b3de8315a0dbe455a13268e75d))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))
* typescript 6 update ([02d2e47](https://github.com/iotaledger/twin-tools/commit/02d2e47859a1d64c81e840626cc2d443816af45b))
* update dependencies ([5bdd8be](https://github.com/iotaledger/twin-tools/commit/5bdd8becf9f08b35342ea8f298f74578951f4bac))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))
* use correct json-ld context schema ([c831486](https://github.com/iotaledger/twin-tools/commit/c8314864a63635556cd5f2912162a2989056e974))
* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))
* ajv stack overflow for oneOf on large enums ([#112](https://github.com/iotaledger/twin-tools/issues/112)) ([6be32a3](https://github.com/iotaledger/twin-tools/commit/6be32a3ae5b3cf188c0d1caf1080f497b648705c))
* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))
* missing type definitions when importing relative from dynamic node_modules ([52d9fc5](https://github.com/iotaledger/twin-tools/commit/52d9fc5f2618a09c02b9f5dbe585b37cf60c9f20))
* module resolution ([f3aa10c](https://github.com/iotaledger/twin-tools/commit/f3aa10c9c9af073de392a2ef6b8411e947e991c2))
* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.4-next.0 to 0.0.4-next.1

## [0.0.3](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3...tools-core-v0.0.3) (2026-05-29)


### Features

* release to production ([ad24b7e](https://github.com/iotaledger/twin-tools/commit/ad24b7eb16784165b6c93b5c48788199f0e17526))
* release to production ([#119](https://github.com/iotaledger/twin-tools/issues/119)) ([cc2828a](https://github.com/iotaledger/twin-tools/commit/cc2828a6c68466bfdeaf75b507bc980dddac2cf0))

## [0.0.3-next.31](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.30...tools-core-v0.0.3-next.31) (2026-05-19)


### Features

* update dependencies ([5bdd8be](https://github.com/iotaledger/twin-tools/commit/5bdd8becf9f08b35342ea8f298f74578951f4bac))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.30 to 0.0.3-next.31

## [0.0.3-next.30](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.29...tools-core-v0.0.3-next.30) (2026-05-18)


### Bug Fixes

* ajv stack overflow for oneOf on large enums ([#112](https://github.com/iotaledger/twin-tools/issues/112)) ([6be32a3](https://github.com/iotaledger/twin-tools/commit/6be32a3ae5b3cf188c0d1caf1080f497b648705c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.29 to 0.0.3-next.30

## [0.0.3-next.29](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.28...tools-core-v0.0.3-next.29) (2026-05-14)


### Features

* add examples to json schema ([#109](https://github.com/iotaledger/twin-tools/issues/109)) ([def5b13](https://github.com/iotaledger/twin-tools/commit/def5b1312e7a0ffefe662fb14575cb655d1c0774))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.28 to 0.0.3-next.29

## [0.0.3-next.28](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.27...tools-core-v0.0.3-next.28) (2026-05-11)


### Features

* typescript 6 update ([02d2e47](https://github.com/iotaledger/twin-tools/commit/02d2e47859a1d64c81e840626cc2d443816af45b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.27 to 0.0.3-next.28

## [0.0.3-next.27](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.26...tools-core-v0.0.3-next.27) (2026-03-27)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.26 to 0.0.3-next.27

## [0.0.3-next.26](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.25...tools-core-v0.0.3-next.26) (2026-03-27)


### Features

* add json-schema embedded mode ([#102](https://github.com/iotaledger/twin-tools/issues/102)) ([f070967](https://github.com/iotaledger/twin-tools/commit/f070967f8f3308e0b5320eab278a319c9d229e3e))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.25 to 0.0.3-next.26

## [0.0.3-next.25](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.24...tools-core-v0.0.3-next.25) (2026-03-23)


### Bug Fixes

* module resolution ([f3aa10c](https://github.com/iotaledger/twin-tools/commit/f3aa10c9c9af073de392a2ef6b8411e947e991c2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.24 to 0.0.3-next.25

## [0.0.3-next.24](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.23...tools-core-v0.0.3-next.24) (2026-03-20)


### Features

* use correct json-ld context schema ([c831486](https://github.com/iotaledger/twin-tools/commit/c8314864a63635556cd5f2912162a2989056e974))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.23 to 0.0.3-next.24

## [0.0.3-next.23](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.22...tools-core-v0.0.3-next.23) (2026-03-20)


### Features

* improve inheritance redefinition optionality ([e7024f6](https://github.com/iotaledger/twin-tools/commit/e7024f699988c0b3de8315a0dbe455a13268e75d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.22 to 0.0.3-next.23

## [0.0.3-next.22](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.21...tools-core-v0.0.3-next.22) (2026-03-20)


### Features

* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))
* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))
* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))
* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))
* missing type definitions when importing relative from dynamic node_modules ([52d9fc5](https://github.com/iotaledger/twin-tools/commit/52d9fc5f2618a09c02b9f5dbe585b37cf60c9f20))
* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.21 to 0.0.3-next.22

## [0.0.3-next.21](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.20...tools-core-v0.0.3-next.21) (2026-03-20)


### Features

* add jsdoc tag validation ([971b8d3](https://github.com/iotaledger/twin-tools/commit/971b8d3817d40467bfd7549c99af602f0c590299))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.20 to 0.0.3-next.21

## [0.0.3-next.20](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.19...tools-core-v0.0.3-next.20) (2026-03-20)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.19 to 0.0.3-next.20

## [0.0.3-next.19](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.18...tools-core-v0.0.3-next.19) (2026-03-19)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.18 to 0.0.3-next.19

## [0.0.3-next.18](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.17...tools-core-v0.0.3-next.18) (2026-03-19)


### Features

* add jsdoc default value to schema ([7886a84](https://github.com/iotaledger/twin-tools/commit/7886a84961e692d2054f223e2e99205a654b76a6))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.17 to 0.0.3-next.18

## [0.0.3-next.17](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.16...tools-core-v0.0.3-next.17) (2026-03-19)


### Features

* improve discriminated unions ([9c36ea7](https://github.com/iotaledger/twin-tools/commit/9c36ea7283230089ff19085ddc4b4c30a4e3f8a2))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.16 to 0.0.3-next.17

## [0.0.3-next.16](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.15...tools-core-v0.0.3-next.16) (2026-03-19)


### Features

* ts to schema ([#86](https://github.com/iotaledger/twin-tools/issues/86)) ([ffebda5](https://github.com/iotaledger/twin-tools/commit/ffebda5f14ab5ec734bf37c9fb70a7ec3d4012c3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @twin.org/tools-models bumped from 0.0.3-next.15 to 0.0.3-next.16

## [0.0.3-next.15](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.14...tools-core-v0.0.3-next.15) (2026-03-10)


### Features

* use jsdoc tags for json-ld markup ([1ea872e](https://github.com/iotaledger/twin-tools/commit/1ea872e07a1cc0e94178158a57383d64008e02e3))

## [0.0.3-next.14](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.13...tools-core-v0.0.3-next.14) (2026-03-06)


### Bug Fixes

* improve schema output ([9e53cbe](https://github.com/iotaledger/twin-tools/commit/9e53cbe26e6272323d72c65e277b7d24521fdbba))

## [0.0.3-next.13](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.12...tools-core-v0.0.3-next.13) (2026-03-05)


### Bug Fixes

* work for schema generator spread defect ([1a705ff](https://github.com/iotaledger/twin-tools/commit/1a705ffc74b353f652e74ea43454164a2f6740bf))

## [0.0.3-next.12](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.11...tools-core-v0.0.3-next.12) (2026-02-27)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.11](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.10...tools-core-v0.0.3-next.11) (2026-02-25)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.10](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.9...tools-core-v0.0.3-next.10) (2026-02-25)


### Features

* remove additionalProperties ([f9b5d81](https://github.com/iotaledger/twin-tools/commit/f9b5d81e952468f9579593cb979f2b84db6f0dfa))

## [0.0.3-next.9](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.8...tools-core-v0.0.3-next.9) (2026-02-24)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.8](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.7...tools-core-v0.0.3-next.8) (2026-02-23)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.7](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.6...tools-core-v0.0.3-next.7) (2026-02-04)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.6](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.5...tools-core-v0.0.3-next.6) (2026-01-28)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.5](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.4...tools-core-v0.0.3-next.5) (2026-01-06)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.4](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.3...tools-core-v0.0.3-next.4) (2026-01-05)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.3](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.2...tools-core-v0.0.3-next.3) (2025-11-11)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.3-next.2](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.1...tools-core-v0.0.3-next.2) (2025-11-11)


### Bug Fixes

* additionalItems object check ([ca81668](https://github.com/iotaledger/twin-tools/commit/ca81668e1ee0d2b1a479215265e651932d7b76de))

## [0.0.3-next.1](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.3-next.0...tools-core-v0.0.3-next.1) (2025-11-10)


### Features

* add context id features ([#54](https://github.com/iotaledger/twin-tools/issues/54)) ([41ad65d](https://github.com/iotaledger/twin-tools/commit/41ad65d5ae33d0533d32a2864cd94e5c35e56c76))
* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))
* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))
* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))
* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))
* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))
* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))
* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))
* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))
* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))

## [0.0.2-next.10](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.9...tools-core-v0.0.2-next.10) (2025-10-09)


### Features

* add validate-locales ([97bb11f](https://github.com/iotaledger/twin-tools/commit/97bb11fd9e6ed400e7fa69671075ba78f36ca6e6))

## [0.0.2-next.9](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.8...tools-core-v0.0.2-next.9) (2025-09-23)


### Miscellaneous Chores

* **tools-core:** Synchronize repo versions

## [0.0.2-next.8](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.7...tools-core-v0.0.2-next.8) (2025-09-05)


### Features

* tighten the types included with the regex matching ([e54909b](https://github.com/iotaledger/twin-tools/commit/e54909bded4a19d00560dd3ec783e9146580bda3))

## [0.0.2-next.7](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.6...tools-core-v0.0.2-next.7) (2025-08-29)


### Features

* eslint migration to flat config ([25acfcf](https://github.com/iotaledger/twin-tools/commit/25acfcf4c4e0c496fffeaf67659fe171bc15199a))

## [0.0.2-next.6](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.5...tools-core-v0.0.2-next.6) (2025-08-21)


### Features

* remove auto expanded types from final output ([18e05dc](https://github.com/iotaledger/twin-tools/commit/18e05dc88f71a0a27b79d1d076b1261b42d2c4c2))

## [0.0.2-next.5](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.4...tools-core-v0.0.2-next.5) (2025-08-19)


### Features

* correctly handle auto expand types ([57fce0f](https://github.com/iotaledger/twin-tools/commit/57fce0f9ec4a0876665d70adc6e885f6feb3caf7))

## [0.0.2-next.4](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.3...tools-core-v0.0.2-next.4) (2025-08-19)


### Features

* update framework core ([559cb98](https://github.com/iotaledger/twin-tools/commit/559cb98612c05a05458b37462cda806b9591b18a))

## [0.0.2-next.3](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.2...tools-core-v0.0.2-next.3) (2025-08-05)


### Features

* improve type name normalisation ([1fe28e5](https://github.com/iotaledger/twin-tools/commit/1fe28e567593e46a41a833fbba95fe4cd958f525))

## [0.0.2-next.2](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.1...tools-core-v0.0.2-next.2) (2025-07-17)


### Features

* improve auto expand types ([6181d1d](https://github.com/iotaledger/twin-tools/commit/6181d1daded1f91323195cf7efbc2f1881f38b41))

## [0.0.2-next.1](https://github.com/iotaledger/twin-tools/compare/tools-core-v0.0.2-next.0...tools-core-v0.0.2-next.1) (2025-07-14)


### Features

* add support for auto expand types ([dd1e10a](https://github.com/iotaledger/twin-tools/commit/dd1e10a5b2fea6f80890ff6f3971f48e239cb4c1))

## Changelog
