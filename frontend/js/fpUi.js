(function(fp, $, ng, undefined) {

	fp.app.directive("fpSpinner", [ "$parse", function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				$(element).spinner({
					spin: function(event, ui) {
						setTimeout(function() {
							scope.$apply(function() {
								scope._spinnerVal = element.val();
								$parse(attrs.ngModel + "=_spinnerVal")(scope);
								delete scope._spinnerVal;
							});
						}, 0);
					}
				});
			}
		}
	} ]);

	fp.app.directive("fpColourPicker", [ "fpUtils", "$templateCache", "$rootScope", "$compile", function(fpUtils, $templateCache, $rootScope, $compile) {
		var colourPicker = $($templateCache.get("colour-picker.html")).appendTo("body").hide();
		var scope = $rootScope.$new();
		scope.colours = [ "ffffff", "ffccc9", "ffce93", "fffc9e", "ffffc7", "9aff99", "96fffb", "cdffff", "cbcefb", "cfcfcf", "fd6864",
			"fe996b", "fffe65", "fcff2f", "67fd9a", "38fff8", "68fdff", "9698ed", "c0c0c0", "fe0000", "f8a102", "ffcc67", "f8ff00", "34ff34",
			"68cbd0", "34cdf9", "6665cd", "9b9b9b", "cb0000", "f56b00", "ffcb2f", "ffc702", "32cb00", "00d2cb", "3166ff", "6434fc", "656565",
			"9a0000", "ce6301", "cd9934", "999903", "009901", "329a9d", "3531ff", "6200c9", "343434", "680100", "963400", "986536", "646809",
			"036400", "34696d", "00009b", "303498", "000000", "330001", "643403", "663234", "343300", "013300", "003532", "010066", "340096" ];
		$compile(colourPicker)(scope);
		scope.$evalAsync(); // $compile only replaces variables on next digest

		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				scope.$watch(attrs.ngModel, function(v) {
					var colour = (v && v.match(/^[0-9a-f]{6}$/i) ? v : 'ffffff');
					element.css({ 'background-color': '#' + colour, 'color' : '#' + fpUtils.makeTextColour(colour)});
				});

				var handler = function(e) {
					var target = $(e.target);
					if(target.is("#colour-picker li")) {
						element.val(target.attr("data-colour"));
						element.triggerHandler("input");
					}
					if(!target.is("#colour-picker") && !$(document.activeElement).is(element)) {
						colourPicker.hide();
						$(document).off("click keyup", handler);
					}
				};

				$(element).focus(function() {
					var link = $(this);
					var pos = link.offset();
					colourPicker.show().offset({
						top: pos.top + link.outerHeight(),
						left: pos.left
					});

					$(document).on("click keyup", handler);
				});
			}
		}
	} ]);

	fp.app.directive("fpTitle", function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				if(!$(element).is("title"))
					return;

				scope.$watch(attrs.fpTitle, function(v) {
					// We have to call history.replaceState() in order for the new title to end up in the browser history
					window.history && history.replaceState({ }, v);
					document.title = v;
				});
			}
		};
	});

	fp.app.factory("fpUi", function() {
		return {
			initStyles: function(context) {
				$("button,input[type=submit],input[type=button],input[type=reset]", context).button();
			}
		};
	});

})(FacilPad, jQuery, angular);