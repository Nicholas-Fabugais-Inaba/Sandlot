import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 20 },
  section: { margin: 10, padding: 10, fontSize: 14 },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 10, textAlign: 'center' },
  text: { marginBottom: 5, fontSize: 12 },
  footer: { fontStyle: 'italic', fontSize: 12, color: 'gray', marginTop: 20 },
  smallText: { fontSize: 10, marginTop: 5, color: 'gray' },
});

const MyPDF = ({ data }: { data: Record<string, any> }) => {
  console.log("Data received from directory page", data);
  const waiverTitle = data["Waiver Title"]
  const waiverTexts = data["Waiver Texts"]
  const waiverFooter = data["Waiver Footer"]
  const playerInitials = data["Player Initials"]
  const playerSignature = data["Player Signature"]

  return (
    <Document title={waiverTitle}>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Render the waiver title */}
          <Text style={styles.title}>{waiverTitle}</Text>

          {/* Render each waiver text */}
          {waiverTexts.map((text: string, index: number) => (
          <View key={index}>
            <Text style={styles.text}>
              {text}
            </Text>
            <Text>
              {"\n"}
            </Text>
            {/* bolded player initials */}
            <Text style={styles.smallText}>
              Initials:
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {playerInitials}
            </Text>
            {/* every waiver text has newline after it ;last waiver text exludes newline */}
            {index < waiverTexts.length - 1 && (
              <Text>
                {"\n"}
              </Text>
            )}
          </View>
        ))}


          {/* Render the waiver footer */}
          <Text style={styles.footer}>{waiverFooter}</Text>
          <Text>
            {"\n"}
            <Text style={styles.smallText}>
              Signature:
              {"\n"}
            </Text>
            {/* bolded player signature */}
            <Text style={{ fontWeight: 'bold' }}>
              {playerSignature}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyPDF;