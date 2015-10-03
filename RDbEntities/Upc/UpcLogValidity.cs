using System.Diagnostics.CodeAnalysis;

// ReSharper disable once CheckNamespace
namespace RDbDataModel
{
    [SuppressMessage("ReSharper", "ArrangeThisQualifier")]
    public partial class UpcLog
    {

        public bool IsValid()
        {
            if (this.UserId == null)
            {
                return false;
            }
            if (string.IsNullOrEmpty(this.Upc) || Upc.Length < 10)
            {
                return false;
            }
            if (this.DateTime == null)
            {
                return false;
            }
            return true;
        }
    }
}
