#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@import PSPDFKit;

int main(int argc, char *argv[])
{
  @autoreleasepool {
    [PSPDFKitGlobal setLicenseKey:@"tgxLXm0OlPvoCt8g-6NRKmuuG9sLRqGJuEWlMec3ZNa6fqNi7PatoSbWBl5XsB60ObHF6g0m74UHwZAPc_iTD5DXjHZG-cbI_OggZISYOGRUbzvjHsKw-EUFfeoshEvQOCTzL8JHh610L7rVDANMH1bgZu65RRivz0hbezGbN-JSnKFJLU3e6LqSv8X53rTU_VAsiwvJioRbHmQj"];
    PSPDFKitGlobal.sharedInstance[@"com.pspdfkit.development.suppress-warning-alerts"] = @YES;

    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
