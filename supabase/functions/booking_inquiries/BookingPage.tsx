// Rezdy integration removed — use internal booking flow
import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().max(20).optional(),
  preferred_date: z.string().trim().min(1, 'Preferred date is required'),
  experience_level: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
  paymentChoice: z.enum(['now', 'link', 'none']).optional(),
});

// Simple Web3Forms-powered contact/booking form (no backend needed)
import React from 'react';

// Replace with your Web3Forms access key
const WEB3FORMS_ACCESS_KEY = 'a237fd7a-99eb-4905-89f4-c25ede3abf8c'; // <-- Updated Web3Forms access key

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-16">
      <form
        className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-4"
        action="https://api.web3forms.com/submit"
        method="POST"
      >
        <h1 className="text-2xl font-bold mb-2">Contact / Booking Form</h1>
        <p className="text-sm text-muted-foreground mb-4">Fill out the form and we’ll get back to you soon.</p>

        <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select name="type" defaultValue="booking" className="w-full border rounded p-2">
            <option value="booking">Booking</option>
            <option value="contact">Contact/Inquiry</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input name="name" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input name="phone" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message *</label>
          <textarea name="message" required rows={4} className="w-full border rounded p-2" />
        </div>

        {/* Web3Forms success/fail messages */}
        <input type="hidden" name="subject" value="New Booking/Contact Submission" />
        <input type="hidden" name="redirect" value="/thank-you" />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
        )}

        {/* Special Packages Banner */}
        {!hasDirectBookingContext && (
          <div className="mb-6 p-6 border-2 border-emerald-500 rounded-lg bg-emerald-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-4xl">🎓</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">3 Specialty Bundle - Save ฿6,000!</h3>
                <p className="text-emerald-800 mb-3">
                  Enroll in three PADI Specialty Dive Courses and pay less. It's a unique opportunity to explore various aspects of scuba diving, from marine life identification to underwater photography.
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-emerald-900">฿18,000</span>
                  <span className="text-emerald-700 line-through text-xl">฿24,000</span>
                  <span className="text-sm text-emerald-700">(3 courses of your choice)</span>
                </div>
                <Button 
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.location.href = '/booking?item=3%20Specialty%20Bundle&type=course&price=18000&currency=THB'}
                >
                  Book 3 Specialty Bundle
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {itemType === 'course' ? (
                <>
                  <div className="text-lg font-semibold">Course cost</div>
                  <div className="text-2xl font-bold">{totalItemCostMajor > 0 ? `฿${totalItemCostMajor}` : 'Contact us'}</div>
                  {courseFunDiveCostMajor > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Includes Fun Dives add-on: ฿{courseFunDiveCostMajor}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">Deposit payable now (20%): {depositMajor > 0 ? `฿${depositMajor}` : 'Contact us'}</div>
                </>
              ) : itemType === 'dive' ? (
                <>
                  <div className="text-lg font-semibold">Dive price</div>
                  <div className="text-2xl font-bold">{courseCostMajor > 0 ? `฿${courseCostMajor}` : 'Contact us'}</div>
                  <div className="text-sm text-muted-foreground mt-1">Deposit payable now (20%): {depositMajor > 0 ? `฿${depositMajor}` : 'Contact us'}</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-semibold">Accommodation request</div>
                  <div className="text-2xl font-bold">Custom quote</div>
                  <div className="text-sm text-muted-foreground mt-1">We will confirm room options and exact seasonal pricing.</div>
                </>
              )}
            </div>
            {isDiveBooking && (
              <div className="text-right">
                <div className="text-lg font-semibold">Add-ons</div>
                <div className="text-sm text-muted-foreground">Select extras below</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-semibold mb-3">Quick booking options</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isCourseBooking || isDiveBooking) {
                  setStayWithUs(true);
                  setShowStayPopup(true);
                  return;
                }
                navigate('/booking?item=Resort%20Accommodation&type=stay&currency=THB');
              }}
            >
              Stay with us at our resort accommodation
            </Button>
          </div>
        </div>

        {(isCourseBooking || isDiveBooking) && (
          <div className="mb-6 p-3 border rounded-lg bg-blue-700 border-blue-600 text-white text-sm">
            If you choose alternative accommodation, please give us the details so we can arrange all necessary arrangements.
          </div>
        )}

        {isCourseBooking && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-semibold mb-3">Add Fun Dives to your course</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2 mb-3">
              {Array.from({ length: 11 }, (_, i) => i).map((count) => (
                <button
                  key={count}
                  type="button"
                  ONCLICK={() => SETCOURSEFUNDIVECOUNT(COUNT)}

                  {COUNT}
                </BUTTON>
              ))}
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND MB-3">
              PRICING: 1 DIVE = ฿1,000, 2-9 DIVES = ฿900 PER DIVE, 10+ DIVES = ฿800 PER DIVE.
              SELECTED ADD-ON: {COURSEFUNDIVECOUNT} DIVES{COURSEFUNDIVECOUNT > 0 ? ` (฿${COURSEFUNDIVECOSTMAJOR})` : ''}.
            </P>

            <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2 TEXT-SM">
              <INPUT
                TYPE="CHECKBOX"
                CHECKED={STAYWITHUS}
                ONCHANGE={(E) => {
                  CONST CHECKED = E.TARGET.CHECKED;
                  SETSTAYWITHUS(CHECKED);
                  IF (CHECKED) {
                    SETSHOWSTAYPOPUP(TRUE);
                  }
                }}
              />
              STAY WITH US (ACCOMMODATION)
            </LABEL>
          </DIV>
        )}

        {ISCOURSEBOOKING && STAYWITHUS && (
          <DIV CLASSNAME="MB-6 P-3 BORDER ROUNDED-LG BG-EMERALD-50 BORDER-EMERALD-200 TEXT-EMERALD-800 TEXT-SM">
            ACCOMMODATION IS FREE WITH THIS COURSE. COURSE PRICING REMAINS UNCHANGED.
          </DIV>
        )}

        {ISDIVEBOOKING && STAYWITHUS && (
          <DIV CLASSNAME="MB-6 P-3 BORDER ROUNDED-LG BG-BLUE-50 BORDER-BLUE-200 TEXT-BLUE-900 TEXT-SM">
            DEPOSIT PAYABLE NOW FOR YOUR DIVES AND ACCOMMODATION TOTAL PRICING TO BE CONFIRMED. PLEASE LEAVE DETAILS IN THE FORM BELOW AND WE WILL CONTACT TO CONFIRM YOUR TOTAL AMOUNT PAYABLE ON ARRIVAL OR DEPOSIT BEFORE ARRIVING.
          </DIV>
        )}

        {ISFUNDIVEBOOKING && (
          <DIV CLASSNAME="MB-6 P-4 BORDER ROUNDED-LG BG-MUTED/30">
            <H3 CLASSNAME="FONT-SEMIBOLD MB-3">CHOOSE NUMBER OF DIVES</H3>
            <DIV CLASSNAME="GRID GRID-COLS-3 SM:GRID-COLS-5 MD:GRID-COLS-10 GAP-2 MB-3">
              {ARRAY.FROM({ LENGTH: 10 }, (_, I) => I + 1).MAP((COUNT) => (
                <BUTTON
                  KEY={COUNT}
                  TYPE="BUTTON"
                  ONCLICK={() => SETFUNDIVECOUNT(COUNT)}
                  CLASSNAME={`PX-3 PY-2 ROUNDED BORDER TEXT-SM FONT-MEDIUM TRANSITION ${FUNDIVECOUNT === COUNT ? 'BG-BLUE-600 TEXT-WHITE BORDER-BLUE-600' : 'BG-BACKGROUND HOVER:BG-BLUE-50 BORDER-BORDER'}`}
                >
                  {COUNT} {COUNT === 1 ? 'DIVE' : 'DIVES'}
                </BUTTON>
              ))}
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">
              PRICING: 1 DIVE = ฿1,000, 2-9 DIVES = ฿900 PER DIVE, 10+ DIVES = ฿800 PER DIVE.
              CURRENT RATE: ฿{GETFUNDIVERATE(FUNDIVECOUNT)} PER DIVE.
            </P>
          </DIV>
        )}

        {ISDIVEBOOKING && (
          <DIV CLASSNAME="GRID MD:GRID-COLS-2 GAP-6 MB-6">
            {AVAILABLEADDONS.MAP((A) => (
              <LABEL KEY={A.ID} CLASSNAME="FLEX ITEMS-CENTER GAP-3 P-4 BORDER ROUNDED">
                <INPUT TYPE="CHECKBOX" CHECKED={!!SELECTEDADDONS[A.ID]} ONCHANGE={() => SETSELECTEDADDONS(S => ({ ...S, [A.ID]: !S[A.ID] }))} />
                <DIV>
                  <DIV CLASSNAME="FONT-MEDIUM">{A.LABEL}</DIV>
                  <DIV CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">฿{A.AMOUNT}</DIV>
                </DIV>
              </LABEL>
            ))}
          </DIV>
        )}

        <DIV CLASSNAME="MB-6 TEXT-RIGHT">
          <DIV CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">
            {ISSTAYBOOKING ? 'PAYMENT:' : (ISDIVEBOOKING ? 'TOTAL PAYABLE NOW (INCL. ADD-ONS):' : 'TOTAL PAYABLE NOW:')}
          </DIV>
          <DIV CLASSNAME="TEXT-2XL FONT-BOLD">{ISSTAYBOOKING ? 'QUOTE ON REQUEST' : `฿${DEPOSITMAJOR + TOTALADDONS}`}</DIV>
        </DIV>

        <FORM {...FORM}>
          <FORM ONSUBMIT={FORM.HANDLESUBMIT(ONSUBMIT)} CLASSNAME="SPACE-Y-4">
            <FORMFIELD CONTROL={FORM.CONTROL} NAME="NAME" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><USER CLASSNAME="H-4 W-4" /> FULL NAME *</FORMLABEL>
                <FORMCONTROL><INPUT PLACEHOLDER="JOHN DOE" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="EMAIL" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><MAIL CLASSNAME="H-4 W-4" /> EMAIL *</FORMLABEL>
                <FORMCONTROL><INPUT TYPE="EMAIL" PLACEHOLDER="JOHN@EXAMPLE.COM" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PHONE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><PHONE CLASSNAME="H-4 W-4" /> PHONE</FORMLABEL>
                <FORMCONTROL><INPUT PLACEHOLDER="+66 123 456 789" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PREFERRED_DATE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><CALENDAR CLASSNAME="H-4 W-4" /> PREFERRED DATE</FORMLABEL>
                <FORMCONTROL><INPUT TYPE="DATE" {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="EXPERIENCE_LEVEL" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL>EXPERIENCE LEVEL</FORMLABEL>
                <SELECT ONVALUECHANGE={FIELD.ONCHANGE} DEFAULTVALUE={FIELD.VALUE}>
                  <FORMCONTROL>
                    <SELECTTRIGGER>
                      <SELECTVALUE PLACEHOLDER="SELECT YOUR EXPERIENCE LEVEL" />
                    </SELECTTRIGGER>
                  </FORMCONTROL>
                  <SELECTCONTENT>
                    <SELECTITEM VALUE="NONE">NO DIVING EXPERIENCE</SELECTITEM>
                    <SELECTITEM VALUE="BEGINNER">BEGINNER (1-10 DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="INTERMEDIATE">INTERMEDIATE (10-50 DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="ADVANCED">ADVANCED (50+ DIVES)</SELECTITEM>
                    <SELECTITEM VALUE="PROFESSIONAL">PROFESSIONAL DIVER</SELECTITEM>
                  </SELECTCONTENT>
                </SELECT>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="MESSAGE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2"><MESSAGESQUARE CLASSNAME="H-4 W-4" /> MESSAGE</FORMLABEL>
                <FORMCONTROL><TEXTAREA PLACEHOLDER="ANY SPECIAL REQUESTS OR QUESTIONS?" ROWS={3} {...FIELD} /></FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <FORMFIELD CONTROL={FORM.CONTROL} NAME="PAYMENTCHOICE" RENDER={({ FIELD }) => (
              <FORMITEM>
                <FORMLABEL>PAYMENT METHOD</FORMLABEL>
                <FORMCONTROL>
                  <DIV CLASSNAME="SPACE-Y-2">
                    <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2">
                      <INPUT
                        TYPE="RADIO"
                        ID="PAYMENT-NOW"
                        NAME="PAYMENTCHOICE"
                        VALUE="NOW"
                        CHECKED={FIELD.VALUE === 'NOW'}
                        ONCHANGE={() => FIELD.ONCHANGE('NOW')}
                      />
                      <SPAN>{ISSTAYBOOKING ? 'PAY AFTER CONFIRMATION' : 'PAY DEPOSIT NOW WITH PAYPAL'}</SPAN>
                    </LABEL>
                    <LABEL CLASSNAME="FLEX ITEMS-CENTER GAP-2">
                      <INPUT
                        TYPE="RADIO"
                        ID="PAYMENT-NONE"
                        NAME="PAYMENTCHOICE"
                        VALUE="NONE"
                        CHECKED={FIELD.VALUE === 'NONE'}
                        ONCHANGE={() => FIELD.ONCHANGE('NONE')}
                      />
                      <SPAN>{ISSTAYBOOKING ? 'SEND ACCOMMODATION INQUIRY' : 'PAY LATER (INQUIRE ONLY)'}</SPAN>
                    </LABEL>
                  </DIV>
                </FORMCONTROL>
                <FORMMESSAGE />
              </FORMITEM>
            )} />

            <DIV CLASSNAME="FLEX GAP-3 PT-4">
              <BUTTON TYPE="BUTTON" VARIANT="OUTLINE" ONCLICK={() => NAVIGATE(-1)} CLASSNAME="FLEX-1">CANCEL</BUTTON>
              <BUTTON TYPE="SUBMIT" DISABLED={ISSUBMITTING} CLASSNAME="FLEX-1 BG-PRIMARY HOVER:BG-PRIMARY/90">
                {ISSUBMITTING ? 'SENDING...' : 'SUBMIT INQUIRY'}
              </BUTTON>
            </DIV>
          </FORM>
        </FORM>

        {SHOWPAYMENTLINKS && (
          <DIV CLASSNAME="MT-8 P-6 BORDER ROUNDED-XL BG-MUTED/50 TEXT-CENTER SPACE-Y-4">
            <H2 CLASSNAME="TEXT-XL FONT-BOLD">PAY YOUR DEPOSIT</H2>
            <P CLASSNAME="TEXT-MUTED-FOREGROUND">YOUR INQUIRY HAS BEEN SENT! TO SECURE YOUR BOOKING, PAY THE DEPOSIT OF <STRONG>฿{DEPOSITMAJOR + TOTALADDONS}</STRONG> VIA PAYPAL:</P>
            <DIV CLASSNAME="SPACE-Y-3">
              <A
                HREF={`${PAYPAL_LINK}/${DEPOSITMAJOR + TOTALADDONS}THB`}
                TARGET="_BLANK"
                REL="NOOPENER NOREFERRER"
              >
                <BUTTON CLASSNAME="BG-[#0070BA] HOVER:BG-[#005EA6] TEXT-WHITE PX-8 PY-3 TEXT-LG W-FULL">
                  PAY ฿{DEPOSITMAJOR + TOTALADDONS} WITH PAYPAL
                </BUTTON>
              </A>
              <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">OR</P>
              <A
                HREF={PAYPAL_LINK}
                TARGET="_BLANK"
                REL="NOOPENER NOREFERRER"
              >
                <BUTTON VARIANT="OUTLINE" CLASSNAME="PX-8 PY-3 TEXT-LG W-FULL">
                  OPEN PAYPAL.ME/PRODIVINGASIA
                </BUTTON>
              </A>
            </DIV>
            <P CLASSNAME="TEXT-SM TEXT-MUTED-FOREGROUND">OR <BUTTON CLASSNAME="UNDERLINE" ONCLICK={() => { 
              FORM.RESET(); 
              SETSHOWPAYMENTLINKS(FALSE); 
              SETSHOWSKIPPAYMENTPOPUP(TRUE); 
            }}>SKIP PAYMENT FOR NOW</BUTTON></P>
          </DIV>
        )}
      </DIV>

      <ALERTDIALOG OPEN={SHOWSTAYPOPUP} ONOPENCHANGE={SETSHOWSTAYPOPUP}>
        <ALERTDIALOGCONTENT>
          <ALERTDIALOGHEADER>
            <ALERTDIALOGTITLE>{ISCOURSEBOOKING ? 'ACCOMMODATION INCLUDED' : 'ACCOMMODATION REQUEST NOTED'}</ALERTDIALOGTITLE>
            <ALERTDIALOGDESCRIPTION>
              {ISCOURSEBOOKING
                ? 'ACCOMMODATION FREE WITH US FOR COURSES.'
                : 'DEPOSIT PAYABLE NOW FOR YOUR DIVES AND ACCOMMODATION TOTAL PRICING TO BE CONFIRMED. PLEASE LEAVE DETAILS IN THE FORM BELOW AND WE WILL CONTACT TO CONFIRM YOUR TOTAL AMOUNT PAYABLE ON ARRIVAL Or deposit before arriving.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showSkipPaymentPopup}
        onOpenChange={(open) => {
          setShowSkipPaymentPopup(open);
          if (!open) {
            form.reset();
            navigate('/');
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inquiry Sent</AlertDialogTitle>
            <AlertDialogDescription>{SKIP_PAYMENT_MESSAGE}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              form.reset();
              navigate('/');
            }}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingPage;
