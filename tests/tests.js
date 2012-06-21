sink('Bonzo', function(test, ok, before, after) {

  test('add/remove/has classes', 6, function () {
    var el = Q('#class-test');
    ok(!dom(el).hasClass('boosh'), 'element does not start off having class "boosh"');
    ok(dom(el).hasClass('existing-class'), 'element has existing class "existing-class"');
    dom(el).addClass('boosh');
    ok(dom(el).hasClass('boosh'), 'element now has class "boosh" after addClass()');
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"');
    dom(el).removeClass('boosh');
    ok(!dom(el).hasClass('boosh'), 'element no longer has class "boosh" after removeClass()');
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"');
  });

  test('add/remove/has multiple classes', 12 + 6 * 4, function () {
    var el = Q('#class-test');
    ok(!dom(el).hasClass('boosh'), 'element does not start off having class "boosh"');
    ok(!dom(el).hasClass('foo'), 'element does not start off having class "foo"');
    ok(!dom(el).hasClass('bar'), 'element does not start off having class "bar"');
    ok(dom(el).hasClass('existing-class'), 'element has existing class "existing-class"');
    dom(el).addClass('boosh foo bar');
    ok(dom(el).hasClass('boosh'), 'element now has class "boosh" after addClass()');
    ok(dom(el).hasClass('foo'), 'element now has class "foo" after addClass()');
    ok(dom(el).hasClass('bar'), 'element now has class "bar" after addClass()');
    ok(dom(el).hasClass('existing-class'), 'element still has pre-existing class "existing-class"');
    dom(el).removeClass('foo bar boosh');
    ok(!dom(el).hasClass('boosh'), 'element no longer has class "boosh" after removeClass()');
    ok(!dom(el).hasClass('foo'), 'element no longer has class "foo" after removeClass()');
    ok(!dom(el).hasClass('bar'), 'element no longer has class "bar" after removeClass()');
    ok(el[0].className == 'existing-class', 'element is reset to class="existing-class"');

    // whitespace tests

    // 4 ok's each call
    function testwhitespace(s, expected, existing) {
      var ps = s.replace(/\t/, '\\t')
      ok(existing || !dom(el).hasClass(s), 'correctly performed !hasClass for "' + ps + '"')
      dom(el).addClass(s)
      ok(el[0].className == 'existing-class ' + expected, 'correctly added class(es) for "' + ps + '"')
      ok(existing || dom(el).hasClass(s), 'correctly performed hasClass for "' + ps + '"')
      dom(el).removeClass(s)
      ok(el[0].className == existing ? '' : 'existing-class', 'correctly removed class(es) for "' + ps + '"')
      if (existing) // reset
        el[0].className = 'existing-class'
    }

    testwhitespace('  foo', 'foo')
    testwhitespace('foo  ', 'foo')
    testwhitespace(' \tfoo ', 'foo')
    testwhitespace(' foo bar\tbaz  ', 'foo bar baz')
    // special cases of trying to re-add existing classes
    testwhitespace('existing-class foo', 'foo', true)
    testwhitespace('foo existing-class', 'foo', true)

  });

  test('toggleClass', 3, function () {
    ok($('#toggle-class').hasClass('toggle-me'), 'has class toggle-me');
    $('#toggle-class').toggleClass('toggle-me');
    ok(!$('#toggle-class').hasClass('toggle-me'), 'removed class toggle-me');
    $('#toggle-class').toggleClass('toggle-me');
    ok($('#toggle-class').hasClass('toggle-me'), 'has class toggle-me');
  });


  test('toggle multiple classes', 9, function () {
    var el = Q('#toggle-class')
    ok(dom(el).hasClass('toggle-me'), 'has class toggle-me')
    ok(!dom(el).hasClass('foo'), 'doesn\'t have class foo')
    ok(!dom(el).hasClass('bar'), 'doesn\'t have class bar')
    dom(el).toggleClass('toggle-me foo bar')
    ok(!dom(el).hasClass('toggle-me'), 'removed class toggle-me')
    ok(dom(el).hasClass('foo'), 'has class foo')
    ok(dom(el).hasClass('bar'), 'has class bar')
    dom(el).toggleClass('  foo\ttoggle-me  bar   ')
    ok(dom(el).hasClass('toggle-me'), 'has class toggle-me')
    ok(!dom(el).hasClass('foo'), 'removed class foo')
    ok(!dom(el).hasClass('bar'), 'removed class bar')
  })

  test('bonzo.create() should not error with empty string', 1, function () {
    var noError = true
    try {
      $('body').append('')
    } catch (ex) {
      noError = false
    } finally {
      ok(noError, '$("body").append("")')
    }

  })

  test('should append nodes', 1, function () {
    $('#append div').append('<p>hello</p><p>world <a href="#">hunger</a></p>');
    ok(Q('#append p').length == 4, 'appended two {p} nodes on all elements');
  });

  test('should prepend nodes', 2, function () {
    $('#prepend').prepend('<p>hello</p><p>world <a href="#">hunger</a></p>');
    ok(Q('#prepend p')[0] == Q('#prepend')[0].firstChild, 'prepend two {p} nodes on all elements');
    ok(Q('#prepend p').length == 2, 'prepended 2 {p} nodes');
  });

  test('should insert nodes before target', 2, function () {
    var el = document.createElement('span');
    el.innerHTML = '<b>some <em>shiza</em></b>';
    $('.before-examples').before(el);
    ok(Q('#before span').length == 2, 'inserted all nodes');
    ok(Q('#before span')[0] == Q('.before-examples')[0].previousSibling, 'target node inserted before collection');
  });

  test('should insert nodes after target', 2, function () {
    $('.after-examples').after('<span>some <em>shiza</em></span>');
    ok(Q('#after em').length == 2, 'inserted all nodes');
    ok(Q('#after span')[0] == Q('.after-examples')[0].nextSibling, 'inserted node after target');
  });

  test('should insert target before nodes', 1, function () {
    $($.create('<p>eyo</p>')).insertBefore($('.before-target'));
    ok(Q('.before-target')[0].previousSibling.tagName.toLowerCase() == 'p', 'created element was inserted before the target');
  });

  test('should insert target after nodes', 1, function () {
    $($.create('<p>eyo</p>')).insertAfter($('.after-target'));
    ok(Q('.after-target')[0].nextSibling && Q('.after-target')[0].nextSibling.tagName.toLowerCase() == 'p', 'created element was inserted after the target');
  });

  test('should insert target after last node', 1, function () {
    $($.create('<p>eyo</p>')).insertAfter($('.after-last-target'));
    ok(Q('.after-last-target')[0].nextSibling && Q('.after-last-target')[0].nextSibling.tagName.toLowerCase() == 'p', 'created element was inserted after the target (target is last child)');
  });

  test('get and set html', 9, function () {
    var fixture = '<p>oh yeeeeeah!</p>'
      , fixture2 = '&lt;oh yeeeeeah&gt;'
      , fixture3 = '<div>oh yeeeeeah!</div>'
      , fixture4 = '<span>oh yeeeeeah!</span>'

    $('#html').html(fixture);
    ok(Q('#html')[0].innerHTML.toLowerCase() == fixture, 'sets appropriate fixture html');
    ok($('#html').html().toLowerCase() == fixture, 'gets appropriate fixture html');

    $('#html').empty().html(fixture2);
    ok(Q('#html')[0].innerHTML == fixture2, 'sets appropriate tag-less fixture html');
    ok($('#html').html() == fixture2, 'gets appropriate tag-less fixture html');

    var ex = false
    try { $('#html-p').html(fixture3); }
    catch(e) { ex = true }
    finally {
      ok(!ex, 'setting block-level fixture inside paragraph element doesn\'t throw exception');
      ok($('#html-p').html().toLowerCase() == fixture3, 'block-level element actually got appended to &lt;p&gt;')
    }

    var ex = false
    try { $('#html-p').html(fixture4); }
    catch(e) { ex = true }
    finally {
      ok(!ex, 'setting inline fixture inside paragraph element doesn\'t throw exception');
      ok($('#html-p').html().toLowerCase() == fixture4, 'inline element actually got appended to &lt;p&gt;');
    }

    var ex = false
    try { var el = $($.create(fixture)).html(fixture)[0]; }
    catch(e) { ex = true }
    finally {
      ok(el && el.innerHTML.toLowerCase().indexOf(fixture) != -1, 'got a &lt;p&gt; into a &lt;p&gt;');
    }
  });

  test('set html on special tags', 3, function () {
    var fixture = '<option class="bad">i am an option</option>'
      , fixture2 = '<option>i am an option</option><option>and yet another</option>'
      , fixture3 = 'chicka chicka chomp chomp'

    $('#html-select').append('<select id="select-test-2"/>');
    $('#select-test-2').html(fixture2);
    ok($('#select-test-2 option').length == 2, "$('#select-test-2 option').length == 2");

    $('#html-select').append('<select id="select-test"/>');
    $('#select-test').html(fixture);
    ok($('#select-test option').length == 1, "$('#select-test option').length == 1");

    $('#html-table').append('<table><tbody><tr><td id="table-test"></td></tr></tbody></table>')
    $('#table-test').html(fixture3)
    ok($('#table-test')[0].innerHTML == fixture3, 'sets appropriate html in TD element')
  });

  test('get and set text', 4, function () {
    var fixture = '<p>boosh</p>'
      , expected = '&lt;p&gt;boosh&lt;/p&gt;';

    $('#text').text(fixture);
    ok(Q('#text')[0].innerHTML.toLowerCase() == expected, 'sets appropriate fixture text');
    ok($('#text').text().toLowerCase() == fixture, 'gets appropriate fixture text');

    $('#html-table').empty().append('<table><tbody><tr><td id="table-test"></td></tr></tbody></table>')
    $('#table-test').text(fixture)
    ok($('#table-test')[0].innerHTML == expected, 'sets appropriate fixture text in TD element')
    ok($('#table-test').text() == fixture, 'gets appropriate fixture text in TD element');
  });

  test('show and hide', 6, function () {
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow');
    $('#show-hide').hide();
    ok(Q('#show-hide')[0].offsetWidth == 0, 'element has no flow');
    $('#show-hide').show();
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow');
    $('#show-hide').hide();
    ok(Q('#show-hide')[0].offsetWidth == 0, 'element has no flow');
    $('#show-hide').attr('class','show-hide-css');
    $('#show-hide').show('block');
    ok(Q('#show-hide')[0].offsetWidth > 0, 'element has flow');
    $('#show-hide').hide();
    $('#show-hide').show('inline');
    ok($('#show-hide').css('display') == 'inline', 'element has flow');
  });

  test('toggle', 5, function () {
    ok($('#toggle').offset().width > 0, 'element has flow')
    $('#toggle').toggle(function () {
      ok(true, 'callback in toggle gets called')
    })
    ok($('#toggle').offset().width == 0, 'element has no flow')
    $('#toggle').toggle()
    ok($('#toggle').offset().width > 0, 'element has flow after toggling again')
    $('#toggle').toggle()
    $('#toggle').toggle(null, 'inline')
    ok($('#toggle')[0].style.display == 'inline', 'toggle accepts type override')
  })

  test('offsets', 6, function () {
    var $el = $(dom.create('<div/>')).css({
          position: 'absolute',
          left: '50px',
          top: -999
        }).appendTo(document.body)

    ok($el.offset().left == 50, 'initial offset.left is 50');
    ok($el.offset().left == 50, 'initial offset.top is -999');
    $el.offset(100, null);
    $el.offset(null, -100);
    ok($el.offset().left == 100, 'after offset(100, null), left == 100');
    ok($el.offset().top == -100, 'after offset(null, -100), top == -100');

    $el.offset(0, 0);
    ok($el.offset().top == 0, 'setting "0" doesnt become falsy')
    ok($el.offset().left == 0, 'setting "0" doesnt become falsy')
  })

  test('offset + scroll', 2, function () {
    var $el = $(dom.create('<div/>')).css({
          width: '100px',
          height: '100px',
          'max-height': '100px',
          overflow: 'scroll',
          position: 'relative'
        }).appendTo(document.body)

      , $el2 = $(dom.create('<div/>')).css({
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '50px',
          left: '50px'
        }).appendTo($el)

    $el[0].scrollTop = 50
    $el[0].scrollLeft = 50

    ok($el2.offset().top == $el.offset().top, 'account for scrollTop')
    ok($el2.offset().left == $el.offset().left, 'account for scrollLeft')
  })

  test('offset() returns 0s when element not found', 4, function () {
    var nullSet = $('div.this-element-dont-exist').offset()
    ok(!nullSet.left, 'no offset().left')
    ok(!nullSet.top, 'no offset().top')
    ok(!nullSet.width, 'no offset().width')
    ok(!nullSet.height, 'no offset().height')
  })

  test('dimensions', 5, function () {
    var $el = $(dom.create('<div/>')).css({
            position: 'absolute'
          , left: '50px'
          , top: '-999px'
          , height: '30px'
          , width: '40px'
          , padding: 0
          , border: 'solid 1px #f00'
        }).appendTo(document.body)
      , $hidden = $(dom.create('<p>some text in here</p>')).hide().css({
             marginLeft: '100px'
           , marginRight: '100px'
        }).appendTo(document.body)

    ok($el.dim().height == 32, 'dim().height is 32');
    ok($el.dim().width == 42, 'dim().width is 42');

    ok($hidden.dim().height > 0 && $hidden.dim().height < 100, 'hidden element dim().height is reasonable non-zero');
    ok($hidden.dim().width > 0 && $hidden.dim().width < 10000, 'hidden element dim().width is reasonable non-zero');
    ok($hidden[0].style.display == 'none', 'hidden element is still hidden after dim() call');
  });

  test('should augment special methods', 3, function () {
    ok(!dom('#augment').color, 'bonzo has no "color" method');
    dom.aug({
      color: function (color) {
        ok(this.prototype == dom().prototype, 'calls augmented methods in scope of bonzo prototype');
        this.css('color', color);
      }
    });
    $('#augment').color('red');
    ok(!!dom('#augment').color, 'bonzo now has a "color" method');
  });

  test('viewport width & height', 2, function () {
    ok(isFinite($.viewport().width), 'has width property');
    ok(isFinite($.viewport().height), 'has height property');
  });

  test('document width & height', 2, function () {
    ok(isFinite($.doc().width), 'has width property');
    ok(isFinite($.doc().height), 'has height property');
  });

  test('width & height can be accessed on window and document', 2, function () {
    ok($(window).css('width') == $(document).css('width'), 'win and doc have same width');
    ok($(window).css('height') < $(document).css('height'), 'document height is much larger than win height');
  })

  test('should empty a node without removing node', 2, function () {
    ok(Q('#empty p').length == 3, 'target has 3 {p} elements');
    $('#empty').empty();
    ok(Q('#empty p').length == 0, 'target has 0 {p} elements');
  });

  test('should detach and return node list', 4, function () {
    ok(Q('#detach div').length == 2, 'target originally has 2 nodes');
    var orphans = $('#detach div').detach();
    ok(Q('#detach div').length == 0, 'target has detached 2 nodes');
    ok(orphans.length == 2, '2 orphans were returned');
    ok(!$.isAncestor(document.body, orphans[0]), 'orphans do not exist in document');
  });

  test('setting & getting attributes', 9, function () {
    ok($('a#twitter').attr('href') == 'http://twitter.com/', 'retrieves "href" attribute from anchor');
    ok($('a#hrefrel').attr('href') == '/relative', 'retrieves relative "href" attribute from anchor');
    ok($('a#hrefname').attr('href') == '#name', 'retrieves plain #name "href" attribute from anchor');
    ok($('img#srcabs').attr('src') == 'http://a2.twimg.com/a/1317419607/phoenix/img/twitter_logo_right.png', 'retrieves "src" attribute from image');
    ok($('img#srcrel').attr('src') == '/relative', 'retrieves relative "src" attribute from image');
    $('#resetme')[0].reset() // old IE does a funny cache-restore thing on docready, after this script is loaded but before sink is
                             // run so multiple runs can restore the value set by the next batch of sets on the input element
                             // so reset() right before we test to make sure we're in the original state and we get no failures
    var input = $('#attrs input[type="text"]');
    ok(input.val() == 'eyo', 'retrieves "value" attribute from {input} element');
    ok($('#attrs input[type="checkbox"]').attr('checked'), 'retrieves "checked" attribute without value as true');
    ok(input.attr('value', 'boosh').attr('value') == 'boosh', 'sets value attribute of input');
    input.val('eyoeyo');
    ok(input.val() == 'eyoeyo', 'val(val) can set value on input')
  });

  test('setting attributes using object', 2, function () {
    var input = $('#attrs input[type="text"]');
    input.attr({'value' : 'new-value', 'class' : 'css-class'});
    ok(input.val() == 'new-value', 'sets value attribute of input');
    ok(input.attr('class') == 'css-class', 'sets regular attribute');
  });

  test('first and last', 2, function () {
    ok($('#first-last div').first()[0].id == 'first', 'found first() element');
    ok($('#first-last div').last()[0].id == 'last', 'found last() element');
  });

  test('appendTo', 1, function () {
    var node = $.create('<p>i am append-to</p>')[0]
      , append = Q('#append-to')[0]
    $(node).appendTo(append);
    ok($('#append-to p').length == 1, '$("#append-to p").length == 1 - appended to target node');
  })

  test('prependTo', 3, function () {
    var node = $.create('<p>world</p>')[0]
      , node2 = $.create('<p>hello</p>')[0]
      , prepend = Q('#prepend-to')[0]
      , prependWithNoFirstChild = Q('#prepend-first-child')[0]
    $([node, node2]).prependTo(prepend);
    ok($('#prepend-to p').length == 2, '$("#prepend-to p").length == 2 - prepended to target node');
    ok($('#prepend-to p').first().html() == 'hello', 'first node is "hello"');
    ok($('#prepend-to p').last().html() == 'world', 'last node is "world"');
  })

  test('next', 1, function () {
    ok($('#sibling-tests li.nextr').next().length == 2, 'els.next().length == 2');
  })

  test('previous', 1, function () {
    ok($('#sibling-tests li.nextr').previous().length == 3, 'els.previous().length == 3');
  })

  test('parent', 1, function () {
    ok($('#parent-test').parent()[0].id == 'parent-test-wrapper', 'parent() is parent-test-wrapper')
  })

  test('scrollTop && scrollLeft', 2, function () {
    // there's gotta be a better way to test this than making the spec page height: 10000px
    $(window).scrollTop(1);
    ok($(window).scrollTop() == 1, 'condition1');
    $('#overflowed').scrollLeft(150);
    ok($('#overflowed').scrollLeft() == 150, 'condition2');
  })

  test('setting & getting styles', 5, function () {
    ok($('#styles').css('margin-left') == '5px', 'margin-left is 5px by default');
    $('#styles').css('margin-left', 10);
    ok($('#styles').css('margin-left') == '10px', '10px after update. can also use unitless values');
    $('#styles').css({marginLeft: '15px'});
    ok($('#styles').css('margin-left') == '15px', 'blue after setting color with object');
    ok($('#styles div').css('float') == 'left', 'float is "left" by default');
    $('#styles div').css('float', "right");
    ok($('#styles div').css('float') == 'right', '"right" after update.');
  })

  if (!(bowser.msie && bowser.version <= 8) && !(bowser.firefox && bowser.version < 3.5)) {

    test('setting & getting transform styles', 3, function () {
      ok($('#styles').css('transform') == 'none', 'transform style blank by default');
      $('#styles').css({'transform':'rotate(30deg) scale(4)'});
      ok($('#styles').css('transform') == 'rotate(30deg) scale(4)', 'rotate(30deg) scale(4) after setting \'transform\'');
      $('#styles').css({'transform-origin':'40% 60%'});
      ok($('#styles').css('transform-origin') == '40% 60%', '40% 60% after setting \'transform-origin\' - ' + $('#styles').css('transform-origin'));
    })

  } else {

    test('setting & getting transform styles (old browser)', 3, function () {
      ok($('#styles').css('transform') == null, 'transform style returns null');
      ok($('#styles').css('transform-origin') == null, 'transform-origin style returns null');
      var ex = false
      try {
        $('#styles').css({'transform': 'rotate(30deg) scale(4)', 'transform-origin':'40% 60%'});
      } catch (e) {
        ex = true
      } finally {
        ok(!ex, 'setting transform style doesn\'t throw exception');
      }
    })

  }

  test('settings styles with a callback method', 2, function () {
    $('#callback-styles').css('margin-left', function (el) {
      ok(el == $('#callback-styles').get(0), 'element is passed back to callback')
      return el.getAttribute('data-original')
    })
    ok($('#styles').css('margin-left') == '15px', 'margin-left is 15px after setting with callback');
  })

  test('checkboxes bug', 6, function () {
    // don't trust qwery to get `:checked` pseudo right
    function checkedCount() {
      var cb = $('#checkboxes-bug input[type="checkbox"]'), c = 0;
      for (var i = 0; i < cb.length; cb[i].checked && c++, i++);
      return c;
    }
    ok(checkedCount() == 3, '3 checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").removeAttr('checked')
    ok(checkedCount() == 0, 'no checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").attr('checked', 'checked')
    ok(checkedCount() == 3, '3 checkboxes are checked again')
    $("#checkboxes-bug input[type='checkbox']").first().get(0).click()
    ok(checkedCount() == 2, '2 checkboxes are checked')
    $("#checkboxes-bug input[type='checkbox']").removeAttr('checked')
    ok(checkedCount() == 0, 'no checkboxes are checked again')
    $("#checkboxes-bug input[type='checkbox']").attr('checked', 'checked')
    ok(checkedCount() == 3, 'all checkboxes are checked!')
  })

  test('data read and write', 18, function() {
    var el = $('#data-test'), data
      , attrCount = function(i, c) {
          for (i = c = 0; i < el[0].attributes.length; i++) !!el[0].attributes[i].nodeValue && c++;
          return c
        }
      , expectedAttributes = attrCount()

    // test our DOM impact along the way, should only add a data-uid attribute & nothing else except via attr()

    el.data('disco', 'stu')
    el.data('neverGunna', 'give you up')
    ok(attrCount() == ++expectedAttributes
      , 'element has ' + expectedAttributes + ' attributes after data(k,v) calls (uid)')

    ok(el.data('foo') == 'bar', 'read existing data-* from dom')
    ok(el.data('disco') == 'stu', 'read data set by data(k,v)')

    data = el.data()
    ok(
      data &&
      data.foo === 'bar' &&
      data.disco === 'stu' &&
      data.neverGunna === 'give you up' &&
      data.hooHaa === true &&
      data.noHooHaa === false &&
      data.int === 100 &&
      data.float === 111.11 &&
      data.empty === '' &&
      data.whitespace === '   ' &&
      data.nulltastic === null
      , 'read all data, as correct type, with data()')
    ok(el.data('foo') === 'bar', 'data string #1 correct')
    ok(el.data('disco') === 'stu', 'data string #2 correct')
    ok(el.data('neverGunna') === 'give you up', 'data string #3 correct')
    ok(el.data('hooHaa') === true, 'data boolean (true) correct')
    ok(el.data('noHooHaa') === false, 'data boolean (false) correct')
    ok(el.data('int') === 100, 'data int correct')
    ok(el.data('float') === 111.11, 'data float correct')
    ok(el.data('empty') === '', 'data empty-string correct')
    ok(el.data('whitespace') === '   ', 'data whitespace correct')
    ok(el.data('nulltastic') === null, 'data null correct')
    ok(el.data('nosuchdata') === undefined, 'reading non-existant data yields undefined')
    ok(attrCount() == expectedAttributes
      , 'element still has ' + expectedAttributes + ' attributes after data(k,v),data(k) &amp; data() calls')

    // should be able to set a data-* attrib and read data from it, even after data() has looked for it previously
    el.attr('data-nosuchdata', 'such data!')
    ok(el.data('nosuchdata') === 'such data!'
      , 'reading previously non-existant data yields data written via attrib()')
    ok(attrCount() == ++expectedAttributes
      , 'element now has ' + expectedAttributes + ' attributes writing using attrib()')
  })

  test('data removal', 3, function() {
    var el = $('#data-temp'), fake, data, uid

    el.data('foo', 'bar')

    data = el.data()
    uid = el.data('node-uid')
    el.remove()

    fake = dom({
      attributes: [ { name: 'data-node-uid', value: uid } ],
      getAttribute: function () { return uid }
    }).data()

    ok(data, 'stored data object is intact after removal')
    ok(data.foo == 'bar', 'data object retains old values')
    ok(fake.nodeUid === uid && fake.foo === undefined, 'new data object is wiped clean')
  })

  test('`create` with whitespace', 4, function() {
    var e = $.create('  <p>something in here</p>  <div/>\t')
    ok(e && e.length == 2, 'create() 2 elements with extra whitespace')
    ok(e && e.length == 2 && e[0].nodeType == 1 && e[0].tagName.toLowerCase() == 'p', 'first element of create() called with additional whitespace')
    ok(e && e.length == 2 && e[0].nodeType == 1 && e[0].innerHTML == 'something in here', 'content of first element of create() called with additional whitespace')
    ok(e && e.length == 2 && e[1].nodeType == 1 && e[1].tagName.toLowerCase() == 'div', 'second element of create() called with additional whitespace')
  })

  function testCreate(node, createFn) {
    var e, ex
    try {
      e = createFn ? createFn() : $.create('<' + node + '>')
    } catch (e) {}
    ok(e && e.length == 1 && e[0].tagName.toUpperCase() == node, 'created &lt;' + node + '&gt; element')
    ok(!ex, 'no exception while creating &lt;' + node + '&gt; element')
    delete e
  }

  // omitted from these lists, can't be reliably created across browsers: FRAME FRAMESET HEAD HTML ISINDEX TITLE
  // ABBR omitted because IE6 doesn't know about it but should work in all other browsers
  // AREA omitted because FF3.6 and below can't create it with innerHTML, works in all other browsers
  var html4Tags = 'A ACRONYM ADDRESS B BDO BIG BLOCKQUOTE BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIV DL DT EM FIELDSET FONT FORM H1 H2 H3 H4 H5 H6 HR I IFRAME IMG INPUT INS KBD LABEL LEGEND LI MAP OBJECT OL OPTGROUP OPTION P PRE Q S SAMP SELECT SMALL SPAN STRIKE STRONG SUB SUP TABLE TBODY TD TEXTAREA TFOOT TH THEAD TR TT U UL VAR'.split(' ')
  var html4NoScopeTags = 'BASE LINK PARAM SCRIPT STYLE'.split(' ')

  test('`create` for HTML4 tags', html4Tags.length * 2, function() {
    for (var i = 0; i < html4Tags.length; i++)
      testCreate(html4Tags[i])
  })

  test('`create` for HTML4 NoScope tags', html4NoScopeTags.length * 2, function() {
    for (var i = 0; i < html4NoScopeTags.length; i++)
      testCreate(html4NoScopeTags[i])
  })

  test('`create` IE-NoScope SCRIPT &amp; STYLE with contents', 4, function() {
    // not expecting the contents do do anything here, just trying to insert with contents
    testCreate('SCRIPT', function() {
      return scr = $.create('<script type="text/javascript">var foo = bar;</' + 'script>') // need '</' + 'script>' or else it'll close our main <script> body
    })
    testCreate('STYLE', function() {
      return scr = $.create('<style type="text/css">.foo { color: red; }</style>') // need '</' + 'script>' or else it'll close our main <script> body
    })
  })
})

sink('Selector engine', function (test, ok) {

  test('run insert with created nodes', 1, function () {
    var node = $.create('<p>world</p>')[0]
      , node2 = $.create('<p>hello</p>')[0]
    $([node, node2]).prependTo('.prepend-with-engine');
    ok($('.prepend-with-engine p').length == 4, 'prepends 4 elements total')
  });

  test('run insert with existing nodes', 2, function () {
    $('.prepend-with-engine p').prependTo('.prepend-with-engine-move');
    ok($('.prepend-with-engine p').length == 0, 'prepend now has no elements')
    ok($('.prepend-with-engine-move p').length == 4, 'elements were moved to target selector')
  });

})

sink('Ender bridge', function (test, ok) {

  test('height & width', 8, function () {
    var $el = ender(dom.create('<div/>')).css({
            height: '50px'
          , width: '200px'
        }).appendTo(document.body)

    ok($el.height() == 50, 'initial height() is 50')
    ok($el.width() == 200, 'initial width() is 200')

    $el.height(100)
    ok($el.height() == 100, 'after height(100), height() reports 100')
    ok($el.width() == 200, 'after height(100), width() reports 200')

    $el.width(20)
    ok($el.width() == 20, 'after width(20), width() reports 20')
    ok($el.height() == 100, 'after width(20), height() reports 100')

    $el.height(0)
    ok($el.height() === 0, 'after height(0), height() reports 0')

    $el.width(0)
    ok($el.width() === 0, 'after width(0), width() reports 0')

    $el.remove()
  })

})

sink('Empty-collection safety', function (test, ok) {

  function runWith(label, container) {
    var notest = []
      , zeroargs = []
      , multiargs = []
      , multiargTests = 0

    // utility functions, mainly matchers for expected vs actual
    var isEmptyContainer = function (o) {
          return !!o && o.length === 0 &&
            // if we're working with an Ender container then simply test for the 'ender' func
            (container.ender && o.ender) ||
            // if we're working with Bonzo then we can't access the Bonzo function so __proto__
            // is the best we can do (if it's available! otherwise 'length' is the best)
            (!o.__proto__ || o.__proto__ == container.__proto__)
        }
        // to check for `return this`, the most common case
      , isSameContainer = function (o) { return o === container }
        // to check for `return []`
      , isEmptyArray = function (o) {
          return !!o && o.length === 0 && Object.prototype.toString.call(o) === '[object Array]'
        }
      , isUndefined = function (o) { return o === undefined }
      , isNull = function (o) { return o === null }
      , isFalse = function (o) { return o === false }
        // an empty function
      , K = function () {}


    //-----------------------------------------------------------------------------------------
    // This is the most important bit. We need a definition here for each Bonzo/Ender function
    // that takes one or more arguments or else you'll get failures (see below). You need to
    // define the arguments and what you expect the return value matcher for when the function is
    // called on an empty set. You can include an array of multiple tests if you have different
    // numbers and/or types of arguments.
    // Functions that don't take an argument (at all) can be omitted only if you expect the
    // function to return 'this' (the default test case for no-arg functions).
    // Also note that this data is used to test both Bonzo raw and Bonzo in Ender, though you
    // can define tests that only appear in one.

    var funcTests = {
    //  FUNCTION NAME         ARGUMENT SIGNATURE        ARGUMENTS ARRAY            EXPECTED RESULT MATCHER
        first:         { str: '',                 args: [],                expect: isEmptyContainer }
      , last:          { str: '',                 args: [],                expect: isEmptyContainer }
      , parent:        { str: '',                 args: [],                expect: isEmptyArray }
      , next:          { str: '',                 args: [],                expect: isEmptyArray }
      , previous:      { str: '',                 args: [],                expect: isEmptyArray }
      , dim:           { str: '',                 args: [],                expect: function(r) { return r.height === 0 && r.width === 0 } }
      , get:           { str: 'index',            args: [0],               expect: isNull }
      , detach:        { str: '',                 args: [],                expect: isSameContainer }
      , each: [        { str: 'fn',               args: [K],               expect: isSameContainer }
                     , { str: 'fn, scope',        args: [K, K],            expect: isSameContainer }
        ]
      , deepEach: [    { str: 'fn',               args: [K],               expect: isSameContainer }
                     , { str: 'fn, scope',        args: [K, K],            expect: isSameContainer }
        ]
      , map: [         { str: 'fn',               args: [K],               expect: isEmptyArray }
                     , { str: 'fn, reject',       args: [K, K],            expect: isEmptyArray }
        ]
      , html:          { str: 'html',             args: ['<a/>'],          expect: isSameContainer }
      , text:          { str: 'text',             args: ['text'],          expect: isSameContainer }
      , addClass:      { str: 'className',        args: ['x'],             expect: isSameContainer }
      , removeClass:   { str: 'className',        args: ['x'],             expect: isSameContainer }
      , hasClass:      { str: 'className',        args: ['x'],             expect: isFalse }
      , toggleClass: [ { str: 'className',        args: ['x'],             expect: isSameContainer }
                     , { str: 'className, true',  args: ['x', true],       expect: isSameContainer }
                     , { str: 'className, false', args: ['x', false],      expect: isSameContainer }
        ]
      , show:          { str: '',                  args: [],               expect: isSameContainer }
      , hide:          { str: '',                  args: [],               expect: isSameContainer }
      , append:        { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , prepend:       { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , appendTo:      { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , prependTo:     { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , related:       { str: 'method',            args: ['parentNode'],   expect: isEmptyArray }
      , before:        { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , after:         { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , insertBefore:  { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , insertAfter:   { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , replaceWith:   { str: 'html',              args: ['<a/>'],         expect: isSameContainer }
      , css: [         { str: 'prop',              args: ['color'],        expect: isNull } // not sure about this one, depending on the browser you might get "" for an empty property on a real element and undefined for an unknown property on a real element
                     , { str: 'prop, val',         args: ['color', 'red'], expect: isSameContainer }
                     , { str: '{prop: val}',       args: [{color: 'red'}], expect: isSameContainer }
        ]
      , offset: [      { str: '',                  args: [],               expect: function (r) { return r.top === 0 && r.left === 0 && r.height === 0 && r.width === 0 } }
                     , { str: 'x, y',              args: [1, 1],           expect: isSameContainer }
        ]
      , attr: [        { str: 'key',               args: ['href'],         expect: isNull }
                     , { str: 'key, value',        args: ['href','#x'],    expect: isSameContainer }
                     , { str: '{key: value}',      args: [{href: '#x'}],   expect: isSameContainer }
        ]
      , val: [         { str: '',                  args: [],               expect: isNull }
                     , { str: 'value',             args: ['x'],            expect: isSameContainer }
        ]
      , removeAttr:    { str: 'key',               args: ['href'],         expect: isSameContainer }
      , data: [        { str: 'key',               args: ['x'],            expect: isNull }
                     , { str: 'key, value',        args: ['x','y'],        expect: isSameContainer }
        ]
      , scrollTop: [   { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'y',                 args: [1],              expect: isSameContainer }
        ]
      , scrollLeft: [  { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'x',                 args: [1],              expect: isSameContainer }
        ]
      , toggle: [      { str: '',                  args: [],               expect: isSameContainer }
                     , { str: 'fn',                args: [K],              expect: isSameContainer }
                     , { str: 'fn, type',          args: [K, 'block'],     expect: isSameContainer }
        ]
      //** Ender bridge specific functions **//
      , siblings:      { str: '',                  args: [],               expect: isEmptyContainer }
      , children:      { str: '',                  args: [],               expect: isEmptyContainer }
      , parents: [     { str: '',                  args: [],               expect: isEmptyContainer }
                     , { str: 'selector',          args: ['*'],            expect: isEmptyContainer }
        ]
      , closest: [     { str: '',                  args: [],               expect: isEmptyContainer }
                     , { str: 'selector',          args: ['*'],            expect: isEmptyContainer }
        ]
      , height: [      { str: '',                  args: [],               expect: function (r) {  return r === 0 } }
                     , { str: 'value',             args: [1],              expect: isSameContainer }
        ]
      , width: [       { str: '',                  args: [],               expect: function (r) {  return r === 0 } }
                     , { str: 'value',             args: [1],              expect: isSameContainer }
        ]
    }

    // collect info about the container's functions
    for (var p in container) {
      if (
             p !== 'color'   // introduced in test case for aug()
          && p !== '$'       // Ender self-ref
          && p !== 'forEach' // Ender native
          && typeof container[p] === 'function') {
        if (container[p].length > 0 && funcTests[p]) {
          multiargs.push(p)
          multiargTests += funcTests[p].length || 1
        } else if (container[p].length === 0) zeroargs.push(p)
        else notest.push(p)
      }
    }

    // we have ways to make you test! If you introduce a new function and it ought to have
    // tests listed above then you'll get a failure here
    test(label + ' have test data', Math.max(1, notest.length), function () {
      if (notest.length) {
        for (var i = 0; i < notest.length; i++)
          ok(false, 'test data for function "' + label + '.' + notest[i] + '()"')
      } else
        ok(true, 'test data for all "' + label + '.*()" functions')
    })

    // handle no-arg functions, default return expected is 'this', override that
    // by making an entry in the table above
    test(label + ' zero-argument functions', zeroargs.length, function () {
      for (var i = 0; i < zeroargs.length; i++) {
        var fn = zeroargs[i]
        try {
          var actual = container[fn]()
          if (funcTests[fn]) {
            ok(funcTests[fn].expect(actual)
              , 'got expected return value for "' + label + '.' + fn + '()"'
            )
          } else
            ok(isSameContainer(actual), 'got same ' + label + ' object as return value for "' + label + '.' + fn + '()"')
        } catch (ex) {
          ok(false, 'error while calling "' + label + '.' + fn + '()": ' + (ex.message || ex))
        }
      }
    })

    // for functions that take 1 or more arguments, we need an entry for each function
    // in the table above. You can have as many tests as required to cover all the bases
    test(label + ' multi-argument functions', multiargTests, function (){
      for (var i = 0; i < multiargs.length; i++) {
        var fn = multiargs[i]
          , t = funcTests[fn]
        if (!t.length) t = [t]
        for (var j = 0; j < t.length; j++) {
          try {
            var actual = container[fn].apply(container, t[j].args)
            ok(
              typeof t[j].expect === 'function' ?
                t[j].expect(actual) :
                actual == t[j].expect
              , 'got expected return value for "' + label + '.' + fn + '(' + t[j].str + ')"'
            )
          } catch (ex) {
            ok(false, 'error while calling "' + label + '.' + fn + '(' + t[j].str + ')": ' + (ex.message || ex))
          }
        }
      }
    })
  }

  runWith('Bonzo', dom([]))
  runWith('Ender', ender([]))

})

start();