// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultRouteHandler.cs" company="">
//   Copyright © 2015 
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace App.RDb.Routing
{
    using System;
    using System.Web;
    using System.Web.Routing;
    using System.Web.WebPages;

    public class DefaultRouteHandler : IRouteHandler
    {
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return WebPageHttpHandler.CreateFromVirtualPath("~/views/index.cshtml");
        }
    }
}
