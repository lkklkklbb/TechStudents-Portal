import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CollegeLogo from "@/components/college-logo";

export default function CollegeInfo() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col items-center mb-8">
        <CollegeLogo size="xl" className="mb-4" />
        <h1 className="text-3xl font-bold text-primary text-center">{t("collegeInfoTitle")}</h1>
        <p className="text-lg text-muted-foreground mt-2 text-center max-w-2xl">
          {t("collegeInfoDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* History Section */}
        <Card className="shadow-md border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-primary">{t("collegeHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t("collegeHistoryDesc")}
            </p>
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">1983</h3>
              <p className="text-sm">تأسيس الكلية التقنية بالرياض</p>
              
              <h3 className="font-semibold text-primary mb-2 mt-4">1990</h3>
              <p className="text-sm">توسعة مرافق الكلية وإضافة تخصصات جديدة</p>
              
              <h3 className="font-semibold text-primary mb-2 mt-4">2005</h3>
              <p className="text-sm">تطوير المناهج وإدخال التقنيات الحديثة في التعليم</p>
              
              <h3 className="font-semibold text-primary mb-2 mt-4">2020</h3>
              <p className="text-sm">إطلاق البرامج التعليمية الإلكترونية والتعلم عن بعد</p>
            </div>
          </CardContent>
        </Card>

        {/* Vision & Mission Section */}
        <Card className="shadow-md border-t-4 border-t-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl text-primary">{t("collegeVision")}</span>
              <span>&</span>
              <span className="text-2xl text-primary">{t("collegeMission")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold text-primary mb-2">{t("collegeVision")}</h3>
            <p className="text-muted-foreground mb-6">{t("collegeVisionDesc")}</p>
            
            <Separator className="my-6" />
            
            <h3 className="text-xl font-semibold text-primary mb-2">{t("collegeMission")}</h3>
            <p className="text-muted-foreground">{t("collegeMissionDesc")}</p>

            <div className="mt-6 bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">قيمنا</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>التميز والجودة في التعليم</li>
                <li>الابتكار والإبداع</li>
                <li>المسؤولية المجتمعية</li>
                <li>الاحترام المتبادل والتعاون</li>
                <li>التطوير المستمر</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="shadow-md mt-8 border-t-4 border-t-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-primary">{t("collegeAchievements")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {t("collegeAchievementsDesc")}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">الاعتماد الأكاديمي</h3>
              <p className="text-sm">حصلت الكلية على الاعتماد الأكاديمي من هيئات محلية ودولية لبرامجها التعليمية المتميزة.</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">شراكات صناعية</h3>
              <p className="text-sm">أقامت الكلية شراكات استراتيجية مع شركات تقنية عالمية لتدريب الطلاب وتوفير فرص عمل للخريجين.</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">المشاريع الطلابية</h3>
              <p className="text-sm">فاز طلاب الكلية بجوائز محلية وإقليمية في مسابقات الابتكار والمشاريع التقنية.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-primary mb-4">الإحصائيات</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-primary/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm">خريجون</div>
              </div>
              <div className="text-center bg-primary/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm">برامج تعليمية</div>
              </div>
              <div className="text-center bg-primary/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm">معدل التوظيف</div>
              </div>
              <div className="text-center bg-primary/10 p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary">30+</div>
                <div className="text-sm">شراكات دولية</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Facilities Section */}
      <Card className="shadow-md mt-8 border-t-4 border-t-secondary">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-primary">مرافق الكلية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            تتمتع الكلية التقنية بالرياض بمرافق حديثة ومتطورة تدعم العملية التعليمية وتوفر بيئة محفزة للطلاب.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">معامل تقنية متطورة</h3>
              <p className="text-sm">توفر الكلية معامل حاسوبية وتقنية مجهزة بأحدث التقنيات لتدريب الطلاب على المهارات العملية.</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">مكتبة رقمية</h3>
              <p className="text-sm">مكتبة شاملة تضم آلاف المراجع والكتب والدوريات العلمية، بالإضافة إلى موارد رقمية متنوعة.</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">قاعات دراسية ذكية</h3>
              <p className="text-sm">قاعات دراسية مجهزة بأنظمة تعليمية ذكية لتعزيز تجربة التعلم وزيادة التفاعل بين الطلاب والمدرسين.</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-primary mb-2">مركز للابتكار</h3>
              <p className="text-sm">مركز متخصص يوفر بيئة محفزة للإبداع والابتكار، ويدعم مشاريع الطلاب ويساعدهم على تطوير أفكارهم.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}