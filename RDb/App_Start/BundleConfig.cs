// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="">
//   Copyright © 2015 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App.RDb
{
    using System.Web.Optimization;

    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/content/css/app").Include("~/content/app.css"));

            bundles.Add(new ScriptBundle("~/js/base").Include(
                "~/scripts/vendor/jquery-{version}.js",
                "~/scripts/vendor/angular.min.js",
                "~/scripts/vendor/angular-ui-router.js"
            ));

            bundles.Add(new ScriptBundle("~/js/app").Include(
                
                "~/scripts/filters.js",
                "~/scripts/services.js",
                "~/scripts/directives.js",
                "~/scripts/controllers.js",
                "~/scripts/app.js"
            ));

            bundles.Add(new ScriptBundle("~/js/app/upc").Include(
                "~/app/rdb.js",
                "~/app/Data/DataSvc.js",
                "~/app/UPC/HomeCtrl.js"
            ));
        }
    }
}
