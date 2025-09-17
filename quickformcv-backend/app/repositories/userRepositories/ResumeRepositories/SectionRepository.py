from uuid import UUID, uuid4
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.userModels.resumeModel import ResumeSection
from sqlalchemy.orm.attributes import flag_modified


class SectionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_initial_sections(self, resume_id: UUID, sections: List[Dict[str, Any]]) -> List[ResumeSection]:
        """Create initial sections for a new resume."""
        db_sections = []
        for section in sections:
            db_section = ResumeSection(
                resume_id=resume_id,
                section_type=section["section_type"],
                section_data=section["section_data"]
            )
            self.db.add(db_section)
            db_sections.append(db_section)

        self.db.commit()
        return db_sections

    def get_section_by_type(self, resume_id: UUID, section_type: str) -> Optional[ResumeSection]:
        """Get a section by its type."""
        return self.db.query(ResumeSection).filter(
            ResumeSection.resume_id == resume_id,
            ResumeSection.section_type == section_type
        ).first()

    def add_or_update_summary_section(self, resume_id: UUID, summary_content: str) -> ResumeSection:
        """Add or update a summary section for a resume"""
        existing_summary = self.get_section_by_type(resume_id, "summary")

        if existing_summary:
            existing_summary.section_data = {
                "name": "Summary",
                "columns": 1,
                "content": summary_content
            }
            self.db.commit()
            self.db.refresh(existing_summary)
            return existing_summary
        else:
            new_summary = ResumeSection(
                resume_id=resume_id,
                section_type="summary",
                section_data={
                    "name": "Summary",
                    "columns": 1,
                    "content": summary_content
                }
            )
            self.db.add(new_summary)
            self.db.commit()
            return new_summary

    def toggle_item_visibility(self, resume_id: UUID, section_type: str, item_id: str) -> Optional[Dict]:
        """Toggle the hidden status of an item within a section."""
        try:
            section = self.get_section_by_type(resume_id, section_type)

            if not section:
                return None

            section_data = dict(section.section_data)
            item = self.find_item_by_id(section_data, item_id)

            if not item:
                return None

            # Toggle the hidden status of the specific item
            current_hidden = item.get("hidden", False)

            # Update the item in the list
            for i, existing_item in enumerate(section_data['items']):
                if existing_item.get('id') == item_id:
                    section_data['items'][i]['hidden'] = not current_hidden
                    break

            section.section_data = section_data
            flag_modified(section, "section_data")

            self.db.commit()
            self.db.refresh(section)

            return {
                "id": section.id,
                "resume_id": section.resume_id,
                "section_type": section.section_type,
                "item_id": item_id,
                "hidden": not current_hidden,
                "section_data": section.section_data
            }

        except Exception as e:
            self.db.rollback()
            raise

    def find_item_by_id(self, section_data: Dict[str, Any], item_id: str) -> Optional[Dict[str, Any]]:
        """Find an item by its ID within a section's data."""
        if 'items' not in section_data:
            return None

        for item in section_data['items']:
            if item.get('id') == item_id:
                return item

        return None

    def add_section_item(self, resume_id: UUID, section_type: str, item_data: dict) -> Optional[Dict]:
        """Add an item to a section. Generates an ID for new items if not provided."""
        try:
            section = self.get_section_by_type(resume_id, section_type)

            if not section:
                return None

            if 'id' not in item_data:
                item_data['id'] = str(uuid4())

            section_data = dict(section.section_data)
            if 'items' not in section_data:
                section_data['items'] = []

            section_data['items'].append(item_data)
            section.section_data = section_data

            # Flag as modified to ensure SQLAlchemy updates the JSONB field
            flag_modified(section, "section_data")
            self.db.commit()
            self.db.refresh(section)

            return {
                "id": section.id,
                "resume_id": section.resume_id,
                "section_type": section.section_type,
                "section_data": section.section_data
            }

        except Exception as e:
            self.db.rollback()
            raise

    def update_section_item(self, resume_id: UUID, section_type: str, item_id: str, item_data: dict) -> Optional[Dict]:
        """Update an existing item in a section by its ID."""
        try:
            section = self.get_section_by_type(resume_id, section_type)

            if not section:
                return None

            section_data = dict(section.section_data)
            item = self.find_item_by_id(section_data, item_id)
            if not item:
                return None

            # Preserve the ID from the original item
            item_data['id'] = item_id

            # Update the item in the list
            for i, existing_item in enumerate(section_data['items']):
                if existing_item.get('id') == item_id:
                    section_data['items'][i] = item_data
                    break

            section.section_data = section_data

            # Flag as modified to ensure SQLAlchemy updates the JSONB field
            flag_modified(section, "section_data")

            self.db.commit()
            self.db.refresh(section)

            return {
                "id": section.id,
                "resume_id": section.resume_id,
                "section_type": section.section_type,
                "section_data": section.section_data
            }

        except Exception as e:
            self.db.rollback()
            raise

    def delete_section_item(self, resume_id: UUID, section_type: str, item_id: str) -> Optional[Dict]:
        """Delete an item from a section by its ID."""
        try:
            section = self.get_section_by_type(resume_id, section_type)

            if not section:
                return None

            section_data = dict(section.section_data)
            item = self.find_item_by_id(section_data, item_id)
            if not item:
                return None

            section_data['items'] = [item for item in section_data['items'] if item.get('id') != item_id]

            section.section_data = section_data
            flag_modified(section, "section_data")
            self.db.commit()
            self.db.refresh(section)

            return {
                "id": section.id,
                "resume_id": section.resume_id,
                "section_type": section.section_type,
                "section_data": section.section_data
            }

        except Exception as e:
            self.db.rollback()
            raise