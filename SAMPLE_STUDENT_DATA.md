# Sample Student Data Format

## Excel File Format

Your Excel file should contain the following columns (case-insensitive):

| Name | Course | Age | BloodGroup | ParentName | ParentPhone | Photo |
|------|--------|-----|------------|------------|-------------|-------|
| John Doe | Computer Science | 20 | A+ | Jane Doe | 9876543210 | https://example.com/photo.jpg |
| Jane Smith | Mathematics | 19 | B+ | John Smith | 9876543211 | |
| Bob Johnson | Physics | 21 | O+ | Mary Johnson | 9876543212 | |

## Column Descriptions

- **Name** (Required): Student's full name - This is the ONLY required field
- **Course** (Optional): Course or program name - Leave blank if not available
- **Age** (Optional): Student's age (must be a number if provided) - Leave blank if not available
- **BloodGroup** (Optional): Blood group (e.g., A+, A-, B+, B-, AB+, AB-, O+, O-) - Leave blank if not available
- **ParentName** (Optional): Parent's or guardian's full name - Leave blank if not available
- **ParentPhone** (Optional): Parent's phone number (can include country code) - Leave blank if not available
- **Photo** (Optional): URL to student's photo or leave empty

**Important:** Only the **Name** column is required. All other fields are optional and can be left blank. Each student will automatically receive a unique Student ID when uploaded.

## Alternative Column Names

The system also accepts these alternative column names:
- Name: `name`, `Student Name`
- Course: `course`, `Course Name`
- Age: `age`, `Age`
- BloodGroup: `bloodGroup`, `Blood Group`
- ParentName: `parentName`, `Parent Name`
- ParentPhone: `parentPhone`, `Parent Phone`

## Notes

- Each row represents one student
- **Only the Name field is required** - all other fields are optional
- Missing optional fields will be stored as blank/empty in the database
- The system will automatically generate a unique Student ID for each student (format: STD + timestamp + random string)
- ID cards will only display fields that have values - blank fields won't appear on the card
- Photo URLs should be publicly accessible if you want to display photos on ID cards
- Empty rows will be skipped
- Example: A student with only Name and Course will still get an ID card with just those two fields displayed

