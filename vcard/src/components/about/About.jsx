import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const About = () => {

	return (
		<section className="text-center">
			<h2 className="text-light fs-1">אודות</h2>
			<div className="text-light p-3 bgTransperent-2 border border-primary rounded boxShadowWhiteBot-10">
				<Row>
					<Col>
						<h4 className="fs-2">רי/מקס חזון</h4>
						<p className="lh-sm">
							סוכנות נדל”ן רי/מקס חזון המובילים בירושלים עם כ40 סוכנים המומחים
							בנכסים בכל רחבי ירושלים, נכסים להשקעה בירושלים והשקעות נדל”ן
							בירושלים.
						</p>
						<p className="lh-sm">
							לרי/מקס חזון יש שיטת שיווק ייחודית ובעלת אחוזי הצלחה גבוהים למכירת
							הנכס שלכם ולמציאת נכס עבורכם היום, כשהעולם כולו עובר למומחיות בכל
							תחום, אנו מציעים לכם לעשות כן גם בנושא חשוב ויקר כמו הנכס שלכם.
						</p>
						<p className="lh-sm">
							צוות סוכני הנדל”ן ברי/מקס חזון מקצועיים ביותר שעברו הרבה הכשרה
							ברמה גבוהה ובעלי רישיון תיווך ממשרד המשפטים דבר המקנה להם ניסיון
							רב בתחומי הנדל’ן השונים: קרקעות למכירה, נחלות למכירה, בתי-יוקרה
							למכירה,דירות יד שנייה למכירה ובתי מגורים יד-שנייה למכירה.
						</p>
						<p className="lh-sm">
							בנוסף לכך וכשירות משלים ללקוח אנו מתחייבים לליווי הלקוחות עד
							להשלמת העסקה בתעריפים מוזלים של שכר טרחת עו”ד, ריבית משכנתאות
							ועוד.
						</p>
					</Col>
				</Row>
			</div>
		</section>
	);
};

export default About;
