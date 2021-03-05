import $ from 'jquery';
import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import { registerDeobfuscationHandlers } from "../utils/ui";
import Main from './main/main';
import { ClientProvider } from './client/client';
import context, { updatePadId, updatePadName } from './context';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import withRender from "./map.vue";
import Vue2TouchEvents from "vue2-touch-events";
import PortalVue from "portal-vue";
import "../utils/validation";
import { PadId } from 'facilmap-types';

Vue.use(BootstrapVue);
Vue.use(Vue2TouchEvents);
Vue.use(PortalVue);

/*fm.app.config(function($compileProvider, $uibTooltipProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);

	$uibTooltipProvider.options({
		placement: "bottom"
	});
});

fm.app.constant("fmSortableOptions", {
	handle: ".sort-handle",
	axis: "y",
	cursor: "move",
	helper: function(e, ui) { // Source: http://www.foliotek.com/devblog/make-table-rows-sortable-using-jquery-ui-sortable/
		ui.children().each(function() {
			$(this).width($(this).width());
		});
		return ui;
	},
	start: function(e, ui) {
		var elChildren = ui.item.children();
		ui.placeholder.children().each(function(i) {
			$(this).width(elChildren.eq(i).width());
			$(this).height(elChildren.eq(i).height());
		});
	},
	stop: function(e, ui) {
		ui.item.children().each(function() {
			$(this).css("width", "");
		});
	}
});*/

// Dereferrer
$(document).on("click", "a", function() {
	const el = $(this);
	const href = el.attr("href");
	if(href && href.match(/^\s*(https?:)?\/\//i)) {
		el.attr("href", "deref.html?"+encodeURIComponent(href));

		setTimeout(function() {
			el.attr("href", href);
		}, 0);
	}
});

registerDeobfuscationHandlers();

new Vue(withRender({
	el: "#loading",
	data: {
		serverUrl: "/",
		padId: context.activePadId
	},
	methods: {
		handlePadIdChange(padId: PadId) {
			updatePadId(padId);
		},

		handlePadNameChange(padName: string) {
			updatePadName(padName);
		}
	},
	components: { ClientProvider, Main }
}));