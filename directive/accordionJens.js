/**
 * Created by Jens on 11.11.2014.
 */
angular.module("jens.accordion.tpls", ["template/accordion/accordion-group-jens.html","template/accordion/accordion-jens.html"]);

angular.module('jens.accordion', ['ui.bootstrap.collapse'])

    .constant('accordionConfigJens', {
        closeOthers: true
    })

    .controller('AccordionControllerJens', ['$scope', '$attrs', 'accordionConfigJens', function ($scope, $attrs, accordionConfigJens) {

        // This array keeps track of the accordion groups
        this.groups = [];

        // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
        this.closeOthers = function(openGroup) {
            var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfigJens.closeOthers;
            if ( closeOthers ) {
                angular.forEach(this.groups, function (group) {
                    if ( group !== openGroup ) {
                        group.isOpen = false;
                    }
                });
            }
        };

        // This is called from the accordion-group directive to add itself to the accordion
        this.addGroup = function(groupScope) {
            var that = this;
            this.groups.push(groupScope);

            groupScope.$on('$destroy', function (event) {
                that.removeGroup(groupScope);
            });
        };

        // This is called from the accordion-group directive when to remove itself
        this.removeGroup = function(group) {
            var index = this.groups.indexOf(group);
            if ( index !== -1 ) {
                this.groups.splice(index, 1);
            }
        };

    }])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
    .directive('accordionJens', function () {
        return {
            restrict:'EA',
            controller:'AccordionControllerJens',
            transclude: true,
            replace: false,
            templateUrl: 'template/accordion/accordion-jens.html'
        };
    })

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
    .directive('accordionGroupJens', function() {
        return {
            require:'^accordionJens',         // We need this directive to be inside an accordion
            restrict:'EA',
            transclude:true,              // It transcludes the contents of the directive into the template
            replace: true,                // The element containing the directive will be replaced with the template
            templateUrl:'template/accordion/accordion-group-jens.html',
            scope: {
                heading: '@',               // Interpolate the heading attribute onto this scope
                isOpen: '=?',
                isDisabled: '=?'
            },
            controller: function() {
                this.setHeading = function(element) {
                    this.heading = element;
                };
            },
            link: function(scope, element, attrs, accordionCtrl) {
                accordionCtrl.addGroup(scope);

                scope.$watch('isOpen', function(value) {
                    if ( value ) {
                        accordionCtrl.closeOthers(scope);
                    }
                });

                scope.toggleOpen = function() {
                    if ( !scope.isDisabled ) {
                        scope.isOpen = !scope.isOpen;
                    }
                };
            }
        };
    })

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
    .directive('accordionHeadingJens', function() {
        return {
            restrict: 'EA',
            transclude: true,   // Grab the contents to be used as the heading
            template: '',       // In effect remove this element!
            replace: true,
            require: '^accordionGroupJens',
            link: function(scope, element, attr, accordionGroupCtrl, transclude) {
                // Pass the heading to the accordion-group controller
                // so that it can be transcluded into the right place in the template
                // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
                accordionGroupCtrl.setHeading(transclude(scope, function() {}));
            }
        };
    })

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
    .directive('accordionTranscludeJens', function() {
        return {
            require: '^accordionGroupJens',
            link: function(scope, element, attr, controller) {
                scope.$watch(function() { return controller[attr.accordionTranscludeJens]; }, function(heading) {
                    if ( heading ) {
                        element.html('');
                        element.append(heading);
                    }
                });
            }
        };
    });


/*EDIT JENS  */
angular.module("template/accordion/accordion-group-jens.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion-group-jens.html",
        "<div class=\"panel panel-default\">\n" +
        "  <div collapse=\"isOpen\" class=\"panel-heading\">\n" +
        "    <h4 class=\"panel-title\">\n" +
        "      <a class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude-jens=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
        "    </h4>\n" +
        "  </div>\n" +
        "  <div class=\"panel-collapse\"  collapse=\"!isOpen\">\n" +
        "	  <div class=\"panel-body\" ng-transclude></div>\n" +
        "  </div>\n" +
        "</div>");
}]);

angular.module("template/accordion/accordion-jens.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion-jens.html",
        "<div class=\"panel-group\" ng-transclude></div>");
}]);