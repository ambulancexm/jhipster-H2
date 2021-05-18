package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Task.
 */
@Entity
@Table(name = "task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "task")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "task" }, allowSetters = true)
    private Set<MxCell> mxCells = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Task name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<MxCell> getMxCells() {
        return this.mxCells;
    }

    public Task mxCells(Set<MxCell> mxCells) {
        this.setMxCells(mxCells);
        return this;
    }

    public Task addMxCell(MxCell mxCell) {
        this.mxCells.add(mxCell);
        mxCell.setTask(this);
        return this;
    }

    public Task removeMxCell(MxCell mxCell) {
        this.mxCells.remove(mxCell);
        mxCell.setTask(null);
        return this;
    }

    public void setMxCells(Set<MxCell> mxCells) {
        if (this.mxCells != null) {
            this.mxCells.forEach(i -> i.setTask(null));
        }
        if (mxCells != null) {
            mxCells.forEach(i -> i.setTask(this));
        }
        this.mxCells = mxCells;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Task)) {
            return false;
        }
        return id != null && id.equals(((Task) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Task{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
