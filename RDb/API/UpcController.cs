using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Ninject;
using RDbDataModel;

namespace App.RDb.API
{
    [RoutePrefix("api/upc")]
    public class UpcController : ApiController
    {
        [Inject]
        public RDbEntities EntityContext { private get; set; }
        
        [HttpGet]
        [EnableCors(origins: "*", headers: "*", methods: "get")]
        [Route("list")]
        public IEnumerable<UpcLog> List()
        {
            var ent = EntityContext.UpcLogs.ToList();
            return ent;
        }

        [HttpPost]
        [EnableCors(origins: "*", headers: "*", methods: "post")]
        [Route("new")]
        public bool New(UpcLog newEntry)
        {
            if (!newEntry.DateTime.HasValue)
            {
                newEntry.DateTime = DateTime.Now;
            }
            if (!newEntry.IsValid())
            {
                return false;
            }
            EntityContext.UpcLogs.Add(newEntry);
            try
            {
                EntityContext.SaveChanges();
            }
            catch (EntityException)
            {
                return false;
            }
            return true;
        }

        [HttpPost]
        [EnableCors(origins: "*", headers: "*", methods: "post")]
        [Route("batch")]
        public bool Batch(List<UpcLog> newEntry)
        {
            EntityContext.UpcLogs.AddRange(newEntry);
            try
            {
                EntityContext.SaveChanges();
            }
            catch (EntityException)
            {
                return false;
            }
            return true;
        }

    }
}