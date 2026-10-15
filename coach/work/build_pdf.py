import json
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from pathlib import Path
root=Path('/Users/jem/Documents/Codex/Baseline Testing/coach')
blue=colors.HexColor('#5d9fd0'); ink=colors.HexColor('#173d50');line=colors.HexColor('#8097a7')
style=ParagraphStyle('body',fontName='Helvetica',fontSize=9,leading=12,textColor=ink)
small=ParagraphStyle('small',parent=style,fontSize=8,leading=10)
head=ParagraphStyle('head',parent=style,fontName='Helvetica-Bold',fontSize=19,leading=23,textColor=colors.white)
sub=ParagraphStyle('sub',parent=style,fontName='Helvetica-Bold',fontSize=12,leading=16)
P=lambda t,st=style:Paragraph(t,st)
story=[]
data=json.loads((root/'work/sheet-data.json').read_text())
for i,d in enumerate(data):
 if i:story.append(PageBreak())
 banner=Table([[P('BH',head),P('BARISTA ZERO<br/><font size="11">BASELINE TESTING SCORESHEET</font>',head)]],colWidths=[22*mm,158*mm]);banner.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),blue),('TOPPADDING',(0,0),(-1,-1),14),('BOTTOMPADDING',(0,0),(-1,-1),14)]));story+=[banner,Spacer(1,5*mm)]
 story += [P('BARISTA: __________________________  COACH: __________________________',small),Spacer(1,2*mm),P('DATE: __________________  ATTEMPT:  1 / 2     SECOND ATTEMPT APPROVED BY: __________________',small),Spacer(1,5*mm),P(f'{i+1}. {d["title"]}',sub)]
 story += [P(f'Time: {"under" if i==2 else "at most"} {d["limit"]} seconds.  Dose: 17 g ± 0.2 g.  Espresso beverage target: ______ g per cup.',small),Spacer(1,2*mm),P('Equipment: Grind-to-weight / Manual + scales     Shot control: Volumetric / Scales',small),P('Mark each item as observed or missed. Blank = not scored. Tare is N/A for grind-to-weight. All applicable criteria required.',small),Spacer(1,3*mm)]
 rows=[[P('Espresso preparation',small),P('First pair' if i==2 else 'Espresso',small)]+([P('Second pair',small)] if i==2 else [])+[P('Baseline standard',small)]]
 for k,label,standard in d['rows']:
  if k=='tare':standard='Manual dosing only. Tare each empty portafilter; once if matched weights.'
  if k=='weight':standard='17 g ± 0.2 g. Verify dose; correct and recheck if necessary.'
  standard=standard.replace('—','-').replace('±','±')
  rows.append([P(label,small),'']+([''] if i==2 else [])+[P(standard,small)])
 widths=[46*mm,22*mm]+([22*mm,90*mm] if i==2 else [112*mm])
 table=Table(rows,colWidths=widths,hAlign='LEFT');table.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.5,line),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#dfedf7')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story+=[table,Spacer(1,4*mm)]
 story +=[P('Preparation time: __________ s     Dose weight(s): __________________ g',style),Spacer(1,2*mm),P('Stop preparation time at the final pump start. Continue observing cup placement and finished service.',small),Spacer(1,4*mm),P('COACH FEEDBACK: __________________________________________________________',small),Spacer(1,5*mm),P('____________________________________________________________________________',small),Spacer(1,4*mm),P('RESULT: Meets draft criteria / Practise again     COACH SIGNATURE: __________________',small),Spacer(1,4*mm),P('Draft Barista Zero adaptation of BH Barista One Baseline espresso standards. Single espresso and long black timings are proposals. No milk or latte-art assessment. A second attempt is at the coach\'s discretion; retain both sheets.',small)]
SimpleDocTemplate(str(root/'output/pdf/barista-zero-baseline-scoresheets.pdf'),pagesize=A4,rightMargin=15*mm,leftMargin=15*mm,topMargin=12*mm,bottomMargin=12*mm).build(story)
