/*
    angular.datatables

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
// original code came from here http://stackoverflow.com/questions/14242455/using-jquery-datatable-with-angularjs
// just giving credit where it's due.

var mimirDirectives = angular.module('DatatablesDirective', []);

mimirDirectives.directive('ngDatatable', ['$compile', function ($compile) {
	"use strict";
    function Link(scope, element, attrs) {
        // apply DataTable options, use defaults if none specified by user
        var options = {};
        if (attrs.ngDatatable.length > 0) {
            options = scope.$eval(attrs.ngDatatable);
        } else {
            options = {
                "bStateSave": true,
                "iCookieDuration": 2419200, /* 1 month */
                "bJQueryUI": false,
                "bPaginate": true,
                "bLengthChange": true,
                "bFilter": true,
                "bSort": true,
                "bInfo": true,
                "bDestroy": true,
                "bProcessing": true,
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    $compile(nRow)(scope);
                }
            };
        }

        // Tell the dataTables plugin what columns to use
        // We can either derive them from the dom, or use setup from the controller           
        var explicitColumns = [];
        element.find('th').each(function (index, elem) {
            explicitColumns.push($(elem).text());
        });
        if (explicitColumns.length > 0) {
            options["aoColumns"] = explicitColumns;
        } else if (attrs.aoColumns) {
            options["aoColumns"] = scope.$eval(attrs.aoColumns);
        }

        // aoColumnDefs is dataTables way of providing fine control over column config
        if (attrs.aoColumnDefs) {
            options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
        }


        // apply the plugin
        scope.dataTable = element.dataTable(options);

        // if there is a custom toolbar, render it.  will need to use toolbar in sdom for this to work
        if (options["sDom"]) {
            if (attrs.toolbar) {
                try {
                    var toolbar = scope.$eval(attrs.toolbar);
                    var toolbarDiv = angular.element('div.toolbar').html(toolbar);
                    $compile(toolbarDiv)(scope);
                } catch (e) {
                    console.log(e);
                }
            }

            if (attrs.extraFilters) {
                try {
                    var filterBar = scope.$eval(attrs.extraFilters);
                    var filterDiv = angular.element('div.extraFilters').html(filterBar);
                    $compile(filterDiv)(scope);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        // this is to fix problem with hiding columns and auto column sizing not working
        scope.dataTable.width('100%');




        // watch for any changes to our data, rebuild the DataTable
        scope.$watch(attrs.aaData, function (value) {
            var val = value || null;
            if (val) {
                scope.dataTable.fnClearTable();
                scope.dataTable.fnAddData(scope.$eval(attrs.aaData));
            }
        }, true);

        if (attrs.selectable) {

            // respond to click for selecting a row
            scope.dataTable.on('click', 'tbody tr', function (e) {
                var elem = e.currentTarget;
                var classes = foo.className.split(' ');
                var isSelected = false;

                for (i = 0; i < classes.length; i++) {
                    if (classes[i] === 'row_selected') {
                        isSelected = true;
                    }
                };


                if (isSelected) {
                    scope.dataTable.find('tbody tr.row_selected').removeClass('row_selected');
                    scope.rowSelected = false;
                }
                else {
                    scope.dataTable.find('tbody tr.row_selected').removeClass('row_selected');
                    elem.className = foo.className + ' row_selected';
                    scope.selectedRow = scope.dataTable.fnGetData(foo);
                    scope.rowSelected = false;
                }
            });
        }
    };


    var directiveDefinitionObject = {
        link: Link,
        scope: true // isoalte the scope of each instance of the directive.
    };

    return directiveDefinitionObject;
} ]);
